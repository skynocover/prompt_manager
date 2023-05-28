import { useState } from 'react';
import * as antd from 'antd';

export const Chat = ({
  loading,
  onSendMessage,
  clear,
}: {
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
    <div className="py-3 mt-auto">
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
  );
};
