import { useState } from 'react';
import * as antd from 'antd';
import { BaseChatMessage } from 'langchain/schema';
import ReactMarkdown from 'react-markdown';

const ChatsAndMessage = ({
  messages,
  loading,
  onSendMessage,
  clear,
}: {
  messages: BaseChatMessage[];
  loading: boolean;
  onSendMessage: (message: string) => void;
  clear: () => void;
}) => {
  const [message, setMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !isComposing) {
      if (!event.shiftKey) {
        event.preventDefault();
        if (message.trim() !== '') {
          onSendMessage(message);
          setMessage('');
        }
      }
    }
  };

  return (
    <>
      <div className="flex flex-col flex-1 mt-5 overflow-scroll">
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
      <div className="py-3">
        <antd.Spin spinning={loading}>
          <div className="flex">
            <div
              className="flex items-center justify-center w-1/6 mr-2 bg-red-400 rounded-md"
              onClick={clear}
            >
              Clear
            </div>
            <textarea
              className="w-full px-3 py-5 bg-gray-300 rounded-xl"
              placeholder="type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
            />
          </div>
        </antd.Spin>
      </div>
    </>
  );
};

export default ChatsAndMessage;
