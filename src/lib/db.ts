import { MongoClient } from "mongodb";

// MongoDB connection function
// export const connectToDatabase = async () => {
//   const client = new MongoClient("mongodb+srv://devsusan24:Temade123@cluster0.6zqp7.mongodb.net/");
//   await client.connect();
//   const db = client.db("Coins"); 
//   return { db, client };
// };


export const connectToDatabase = async () => {
  const client = new MongoClient("mongodb+srv://devsusan24:Temade123@cluster0.6zqp7.mongodb.net/");
  await client.connect();
  const db = client.db("Cryptos"); 
  return { db, client };
};