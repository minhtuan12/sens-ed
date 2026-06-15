import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "sensed";

let clientPromise: Promise<MongoClient> | null = null;

export function hasMongoConfig() {
  return Boolean(uri);
}

export async function getMongoDb(): Promise<Db> {
  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (!clientPromise) {
    clientPromise = new MongoClient(uri).connect();
  }

  return (await clientPromise).db(dbName);
}
