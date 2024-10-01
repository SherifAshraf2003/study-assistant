import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {  RecursiveCharacterTextSplitter } from "@langchain/textsplitters"
import { env } from "./config"

export async function getChunkedDocsFromPDF() {
  try {
    const loader = new PDFLoader(env.PDF_PATH)
    const docs = await loader.load()

    const text_splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200
    })

    const chunkedDocs = await text_splitter.splitDocuments(docs)
    return chunkedDocs;
  }catch(e){
    console.error(e)
    throw new Error("PDF docs chunking failed !")
  }
}