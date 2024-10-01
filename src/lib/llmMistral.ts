// Hypothetical Chat Mistral Model (check Mistral's API for actual implementation)
import { ChatMistralAI } from '@langchain/mistralai';  // This is hypothetical, confirm with Mistral's API.

export const streamingMistralModel = new ChatMistralAI({
  apiKey: process.env.MISTRAL_API_KEY,
  modelName: "mistral-large-latest", // Replace with Mistral's chat model name
  streaming: true, // Assuming Mistral supports streaming
  verbose: true,
  temperature: 0,
});

export const nonStreamingMistralModel = new ChatMistralAI({
  apiKey: process.env.MISTRAL_API_KEY,
  modelName: "mistral-large-latest", // Replace with Mistral's chat model name
  verbose: true,
  temperature: 0,
});
