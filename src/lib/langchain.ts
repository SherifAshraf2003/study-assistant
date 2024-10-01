import { ConversationalRetrievalQAChain, LLMChain } from "langchain/chains";
import { getVectorStore } from "./vector-store";
import { getPineconeClient } from "./pinecone-client";
import {
  StreamingTextResponse,
  experimental_StreamData,
  LangChainStream,
} from "ai";
import { streamingMistralModel, nonStreamingMistralModel } from "./llmMistral";
import { PromptTemplate } from "@langchain/core/prompts";
import {
  STANDALONE_QUESTION_TEMPLATE,
  QUESTION_GENERATION_TEMPLATE,
  DISCUSSION_TEMPLATE
} from "./prompt-templates";

type callChainArgs = {
  question: string;
  chatHistory: string;
};

export async function callChain({ question, chatHistory }: callChainArgs) {
  try {
    // Open AI recommendation
    const sanitizedQuestion = question.trim().replaceAll("\n", " ");
    const pineconeClient = await getPineconeClient();
    const vectorStore = await getVectorStore(pineconeClient);
    const { stream, handlers } = LangChainStream({
      experimental_streamData: true,
    });
    const data = new experimental_StreamData();

    // Create question generation chain
    const questionGenerationChain = new LLMChain({
      llm: nonStreamingMistralModel,
      prompt: new PromptTemplate({
        template: QUESTION_GENERATION_TEMPLATE,
        inputVariables: ["context"],
      }),
    });

    // Create discussion chain
    const discussionChain = new LLMChain({
      llm: streamingMistralModel,
      prompt: new PromptTemplate({
        template: DISCUSSION_TEMPLATE,
        inputVariables: ["context", "question", "human_answer"],
      }),
    });

    const chain = ConversationalRetrievalQAChain.fromLLM(
      streamingMistralModel,
      vectorStore.asRetriever(),
      {
        questionGeneratorTemplate: STANDALONE_QUESTION_TEMPLATE,
        returnSourceDocuments: true, //default 4
        questionGeneratorChainOptions: {
          llm: nonStreamingMistralModel,
        },
      }
    );

    // Determine if this is the start of the conversation
    const isFirstMessage = chatHistory.trim() === "";

    if (isFirstMessage) {
      // Generate an initial question
      const context = await vectorStore.similaritySearch("", 1);
      const { text: generatedQuestion } = await questionGenerationChain.call({
        context: context[0].pageContent,
      });
      
      // Use the generated question as the first response
      handlers.handleLLMNewToken(generatedQuestion);
      
      // Then proceed with the main chain using this generated question
      chain.call(
        {
          question: generatedQuestion,
          chat_history: chatHistory,
        },
        [handlers]
      ).then(async (res) => {
        const sourceDocuments = res?.sourceDocuments;
        const firstTwoDocuments = sourceDocuments.slice(0, 2);
        const pageContents = firstTwoDocuments.map(
          ({ pageContent }: { pageContent: string }) => pageContent
        );
        data.append({
          sources: pageContents,
        });
        data.close();
      });
    } else {
      // For subsequent messages, use the main chain as before
      chain.call(
        {
          question: sanitizedQuestion,
          chat_history: chatHistory,
        },
        [handlers]
      ).then(async (res) => {
        const sourceDocuments = res?.sourceDocuments;
        const firstTwoDocuments = sourceDocuments.slice(0, 2);
        const pageContents = firstTwoDocuments.map(
          ({ pageContent }: { pageContent: string }) => pageContent
        );
        data.append({
          sources: pageContents,
        });
        data.close();
      });
    }

    // Return the readable stream
    return new StreamingTextResponse(stream, {}, data);
  } catch (e) {
    console.error(e);
    throw new Error("Call chain method failed to execute successfully!!");
  }
}