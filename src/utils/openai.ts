import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from 'openai';

export const sendMessage = async (
  content: string,
  apiKey: string,
  system: string,
  oriMessages: ChatCompletionRequestMessage[],
  model = 'gpt-3.5-turbo',
) => {
  const configuration = new Configuration({ apiKey });
  const openai = new OpenAIApi(configuration);

  oriMessages.push({ role: 'user', content });

  const messages = system
    ? [
        {
          role: 'system',
          content: system,
        } as ChatCompletionRequestMessage,
        ...oriMessages,
      ]
    : oriMessages;

  const { data } = await openai.createChatCompletion({
    model,
    messages,
  });
  if (data.choices[0].message) {
    oriMessages.push(data.choices[0].message);
  }

  return oriMessages;
};
