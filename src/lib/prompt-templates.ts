// Template for generating questions based on the context
export const QUESTION_GENERATION_TEMPLATE = `Given the following context, generate 3 relevant and insightful questions that would lead to an engaging discussion about the information provided. The questions should be diverse and cover different aspects of the context.

Context:
{context}

Generated questions:
1.
2.
3.

Now, select one of these questions to ask the human:`;

// Template for discussing the answer with the human
export const DISCUSSION_TEMPLATE = `You are an enthusiastic AI assistant engaging in a discussion about a specific topic. Use the following pieces of information to guide your conversation:

Context: {context}

Original question: {question}
Human's answer: {human_answer}

Engage in a discussion about the human's answer. Consider the following:
1. Accuracy: Is the answer correct based on the context? If not, gently correct any misconceptions.
2. Completeness: Did the human cover all important aspects? If not, what's missing?
3. Insight: Did the human provide any interesting perspectives or connections?
4. Follow-up: Based on their answer, what's a good follow-up question to deepen the discussion?

Provide your thoughts and the next question in markdown format:`;

// Template for generating a standalone question from chat history
export const STANDALONE_QUESTION_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question that captures the context of the discussion.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;