import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

interface Cryptocurrency {
    id: string; 
    network: string;
    coin: string;
    name: string;
    iconUrl: string;
}
  

export async function GET() {
    try {
        const response = await getAllCrytos();
        return NextResponse.json(response)
    } catch (error) {
        console.log(error);
        return NextResponse.error()
    }
}

const getAllCrytos = async () : Promise<Cryptocurrency[]> => {
    try {
      const { db } = await connectToDatabase();
      const cryptoCollection = db.collection("crytoList");
      console.log(cryptoCollection);
      
  
      const allItems = await cryptoCollection.find({}).toArray()
    //   console.log(allItems);
      
      const transformedItems = (allItems).map(item => ({
        id: item._id.toString(),
        network: item.network,
        coin: item.coin,
        name: item.name,
        iconUrl: item.iconUrl
      }))
      return transformedItems
    } catch (error) {
      throw new Error(`Error fetching cryptos: ${error}`)
    }
};
  