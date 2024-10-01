import { env } from './config';
//import { OpenAIEmbeddings } from "@langchain/openai";
import { MistralAIEmbeddings } from '@langchain/mistralai';
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from '@pinecone-database/pinecone';
import { Document } from 'langchain/document'; 


export async function embedAndStoreDocs(
  client: Pinecone,
  docs: Document<Record<string, any>>[]
) {

  try {
    //const embeddings = new OpenAIEmbeddings();
    const embeddings =  new MistralAIEmbeddings({
      apiKey: process.env.MISTRAL_API_KEY, 
      model: 'mistral-embed', 
    });
    const index = client.index(env.PINECONE_INDEX_NAME);
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      textKey: "text",
    });

  }catch(e){
    console.error(e);
    throw new Error("Failed to embed and store documents");
  }

}

export async function getVectorStore(client: Pinecone) {
  try {
    const embeddings = new MistralAIEmbeddings();
    const index = client.Index(env.PINECONE_INDEX_NAME);

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      textKey: 'text',
    });

    return vectorStore;
  } catch (error) {
    console.log('error ', error);
    throw new Error('Something went wrong while getting vector store !');
  }
}