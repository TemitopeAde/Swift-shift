"use server";

import { MongoClient } from "mongodb";

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

interface Cryptocurrency {
  id: string; 
  network: string;
  coin: string;
  name: string;
  iconUrl: string;
}

const connectToDatabase = async () => {
  const client = new MongoClient(
    "mongodb+srv://devsusan24:Temade123@cluster0.6zqp7.mongodb.net/"
  );
  await client.connect();
  const db = client.db("Cryptos");
  return { db, client };
};

export const fetchAllCrypto = async (): Promise<Cryptocurrency[]> => {
  // Step 1: Fetch coins from API
  const response = await fetch("/fetch-crypto");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const coins: Coin[] = await response.json();

  const groupedCoins = await groupCoinsByNetwork(coins);
  console.log(groupedCoins);

  const transformedCoins: Cryptocurrency[] = groupedCoins.map(coin => ({
    id: coin.contractAddress || "", // Generate an ID as needed
    network: coin.network,
    coin: coin.coin,
    name: coin.name,
    iconUrl: coin.iconUrl,
    contractAddress: coin.contractAddress,
    decimals: coin.decimals,
    hasMemo: coin.hasMemo,
    fixedOnly: coin.fixedOnly,
    variableOnly: coin.variableOnly,
    depositOffline: coin.depositOffline,
    settleOffline: coin.settleOffline
  }));

  // console.log(transformedCoins);

  return transformedCoins;
};

export const fetchIconUrl = async (coinId: string): Promise<string> => {
  console.log(coinId, "coin id");
  const response = await fetch(`/coin-image?id=${coinId}`);
  if (!response.ok) {
    throw new Error(`Error fetching icon for coin ID: ${coinId}`);
  }
  const data = await response.json();

  return data.url;
};

export const groupCoinsByNetwork = async (
  coins: Coin[]
): Promise<CoinsByNetwork[]> => {
  const transformedArray: CoinsByNetwork[] = [];
  const uniqueEntries = new Set<string>();

  for (const coin of coins.splice(160,300)) {
    const {
      networks,
      coin: coinSymbol,
      name,
      hasMemo,
      fixedOnly,
      variableOnly,
      tokenDetails,
      depositOffline,
      settleOffline
    } = coin;

    if (!Array.isArray(networks) || !tokenDetails) {
      continue;
    }

    const iconUrl = await fetchIconUrl(coinSymbol);
    // console.log(iconUrl);

    networks.forEach(async network => {
      if (!tokenDetails[network]) {
        console.log(`No token details for network: ${network}`);
        return;
      }

      const { contractAddress, decimals } = tokenDetails[network];
      const uniqueKey = `${coinSymbol}-${network}`;

      if (!uniqueEntries.has(uniqueKey)) {
        uniqueEntries.add(uniqueKey);

        transformedArray.push({
          network,
          coin: coinSymbol,
          name,
          iconUrl,
          hasMemo,
          fixedOnly,
          variableOnly,
          contractAddress: contractAddress || null,
          decimals: decimals || null,
          depositOffline,
          settleOffline
        });

        try {
          // console.log(transformedArray);
          const { db } = await connectToDatabase();
          const cryptoCollection = db.collection("crytoList");
          // console.log(cryptoCollection, "response");

          const result = await cryptoCollection.insertOne(transformedArray);
          // console.log(result, "saved res");
        } catch (error) {
          console.error(`Error saving to MongoDB: ${error}`);
        }
      }
    });
  }
  return transformedArray;
};

export const getAllCrytos = async () : Promise<Cryptocurrency[]> => {
  try {
    const { db } = await connectToDatabase();
    const cryptoCollection = db.collection("crytoList");

    const allItems = cryptoCollection.find({}).toArray()
    const transformedItems = (await allItems).map(item => ({
      id: item._id.toString(),
      network: item.network,
      coin: item.coin,
      name: item.name,
      iconUrl: item.iocnUrl
    }))
    return transformedItems
  } catch (error) {
    throw new Error(`Error fetching cryptos: ${error}`)
  }
};
