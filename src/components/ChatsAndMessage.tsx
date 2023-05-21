import { useState } from 'react';
import * as antd from 'antd';
import { ChatCompletionRequestMessage } from 'openai';
import ReactMarkdown from 'react-markdown';

const ChatsAndMessage = ({
  messages,
  loading,
  onSendMessage,
}: {
  messages: ChatCompletionRequestMessage[];
  loading: boolean;
  onSendMessage: (message: string) => void;
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
      <div className="flex flex-col mt-5">
        {messages.map((m, index) => {
          if (m.role === 'assistant') {
            return (
              <div key={index} className="flex justify-start mb-4">
                <div className="px-4 py-3 ml-2 text-white bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            );
          } else if (m.role === 'user') {
            return (
              <div key={index} className="flex justify-end mb-4">
                <div className="px-4 py-3 mr-2 text-white bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl">
                  {m.content}
                </div>
              </div>
            );
          }
        })}
      </div>
      <div className="py-3">
        <antd.Spin spinning={loading}>
          <textarea
            className="w-full px-3 py-5 bg-gray-300 rounded-xl"
            placeholder="type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
          />
        </antd.Spin>
      </div>
    </>
  );
};

export default ChatsAndMessage;
