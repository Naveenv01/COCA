// global.d.ts
import { MongoClient } from 'mongodb'

declare global {
  var _mongoClientPromise: Promise<MongoClient>; // Declare your global variable here
}

// Export an empty object to make it a module
export {}
