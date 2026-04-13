import { MongoClient, Db } from 'mongodb';

let cached: { client?: MongoClient; db?: Db } = {};

async function connectDB(): Promise<Db> {
  if (cached.db) {
    return cached.db;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined');
  }

  const client = new MongoClient(uri);
  await client.connect();
  
  const db = client.db('re101');
  cached.client = client;
  cached.db = db;
  
  return db;
}

export default connectDB;
