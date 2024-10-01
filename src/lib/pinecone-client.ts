import { Pinecone } from '@pinecone-database/pinecone';



export async function getPineconeClient() {
try {  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });
  const index = pc.index(process.env.PINECONE_INDEX_NAME);
  return pc;
}
catch(e){
  console.log(e);
  throw new Error("Failed to initialize Pinecone client");
}
}