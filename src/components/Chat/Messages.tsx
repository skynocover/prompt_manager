import ReactMarkdown from 'react-markdown';
import { BaseChatMessage } from 'langchain/schema';

export const Messages = ({ messages }: { messages: BaseChatMessage[] }) => {
  return (
    <div className="flex flex-col mt-5 overflow-scroll">
      {messages.map((m, index) => {
        if (m._getType() === 'human') {
          return (
            <div key={index} className="flex justify-end mb-4">
              <div className="px-4 py-3 mr-2 text-white bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl">
                {m.text}
              </div>
            </div>
          );
        } else if (m._getType() === 'ai') {
          return (
            <div key={index} className="flex justify-start mb-4">
              <div className="px-4 py-3 ml-2 text-white bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl">
                <ReactMarkdown>{m.text}</ReactMarkdown>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};
