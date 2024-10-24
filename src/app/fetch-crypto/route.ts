import { MongoClient } from "mongodb";
// import { NextApiResponse } from 'next';
// import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

interface TokenDetails {
  contractAddress: string;
  decimals: number;
}

interface Coin {
  networks: string[];
  coin: string;
  name: string;
  hasMemo: boolean;
  fixedOnly: boolean;
  variableOnly: boolean;
  tokenDetails: Record<string, TokenDetails>;
  depositOffline: boolean;
  settleOffline: boolean;
}

interface CoinsByNetwork {
  network: string;
  coin: string;
  name: string;
  iconUrl: string;
  contractAddress: string | null;
  decimals: number | null;
  hasMemo: boolean;
  fixedOnly: boolean;
  variableOnly: boolean;
  depositOffline: boolean;
  settleOffline: boolean;
}

export async function GET() {
  try {
    const requestOptions = {
      method: "GET"
    };
    const url = "https://sideshift.ai/api/v2/coins";
    const response = await fetch(url, requestOptions);
    const data = await response.json();
    const groupedData = groupCoinsByNetwork(data);
    return NextResponse.json(groupedData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `${error} Internal Server Error` },
      { status: 500 }
    );
  }
}

export const groupCoinsByNetwork = async (
  coins: Coin[]
): Promise<CoinsByNetwork[]> => {
  const transformedArray: CoinsByNetwork[] = [];
  const uniqueEntries = new Set<string>();

  for (const item of coins.slice(82, 200)) {
    const {
      networks,
      coin,
      name,
      hasMemo,
      fixedOnly,
      variableOnly,
      tokenDetails,
      depositOffline,
      settleOffline
    } = item;

    if (!Array.isArray(networks) || !tokenDetails) {
      continue;
    }

    const iconUrl = await fetchIconUrl({ coinId: coin });
    
    for (const network of networks) {
      if (!tokenDetails[network]) {
        // No token details for this network, skip
        continue;
      }

      const { contractAddress, decimals } = tokenDetails[network];
      const uniqueKey = `${coin}-${network}`;

      if (!uniqueEntries.has(uniqueKey)) {
        uniqueEntries.add(uniqueKey);

        const newCoinEntry = {
          network,
          coin,
          name,
          iconUrl,
          hasMemo,
          fixedOnly,
          variableOnly,
          contractAddress: contractAddress || null,
          decimals: decimals || null,
          depositOffline,
          settleOffline,
        };

        transformedArray.push(newCoinEntry);

        try {
          const { db } = await connectToDatabase();
          const cryptoCollection = db.collection("crytoList");

          // Check if the document already exists to prevent duplicates
          const existingCoin = await cryptoCollection.findOne({
            coin: newCoinEntry.coin,
            network: newCoinEntry.network,
          });

          if (!existingCoin) {
            // Insert the new coin entry if it doesn't already exist
            const result = await cryptoCollection.insertOne(newCoinEntry);
            console.log("Inserted:", result);
          } else {
            console.log(`Coin ${newCoinEntry.coin} on ${newCoinEntry.network} already exists.`);
          }

        } catch (error) {
          console.error(`Error saving to MongoDB: ${error}`);
        }
      }
    }
  }

  return transformedArray;
};

const connectToDatabase = async () => {
  const client = new MongoClient(
    "mongodb+srv://devsusan24:Temade123@cluster0.6zqp7.mongodb.net/"
  );
  await client.connect();
  const db = client.db("Cryptos");
  return { db, client };
};

export const fetchIconUrl = async ({coinId}: {
  coinId: string
}) => {
  const url = `https://sideshift.ai/api/v2/coins/icon/${coinId}`
  const response = await fetch(url);
  if (!response.ok) {
    // throw new Error(`Error fetching icon for coin ID: ${coinId}`);
    return `https://res.cloudinary.com/df04essjr/image/upload/v1729716153/apzbejipi0rocylymbhp.svg`
  }
  const contentType = response.headers.get("Content-Type");
  const imageBuffer = await response.arrayBuffer();

  // Convert the image buffer to a base64 string
  const base64Image = Buffer.from(imageBuffer).toString("base64");
  const imageDataUrl = `data:${contentType};base64,${base64Image}`;

  // Upload the image to Cloudinary
  const uploadResponse = await cloudinary.uploader.upload(imageDataUrl, {
    resource_type: "image"
  });
 
  return uploadResponse.secure_url
};
