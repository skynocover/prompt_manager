import React, { useCallback, useEffect, useState } from 'react';
import { Button, Modal, Spin, Input } from 'antd';

import { BaseChatMessage, HumanChatMessage, AIChatMessage } from 'langchain/schema';
import { useProject } from '../domains/project';
import { Messages } from '../components/Messages';
import { parameter, extractSubstrings } from '../components/SystemParameters';

interface ProjectModalProps {
  open: boolean;
  close: () => void;
  preSystem: string;
}

// 定義 ChatBox 介面，包括三個屬性：訊息、參數和系統
interface ChatBox {
  messages: BaseChatMessage[];
  parameters: parameter[];
  system: string;
}

// ABTestChat 函數，為模組主要的導出函數，負責創建聊天模組
export const ABTestChat = ({ preSystem }: { preSystem: string }) => {
  const [openChat, setOpenChat] = useState(false);

  return (
    <>
      <Button type="primary" onClick={() => setOpenChat(true)}>
        A/B Test Chat
      </Button>
      <ChatModal preSystem={preSystem} open={openChat} close={() => setOpenChat(false)} />
    </>
  );
};

const ChatModal: React.FC<ProjectModalProps> = ({ open, close, preSystem }) => {
  const { makeSystemByTemplate, sendMessages } = useProject();

  // 狀態控制
  const [message, setMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  // 初始化聊天框狀態
  const chatBoxInitialState = {
    messages: [],
    parameters: extractSubstrings(preSystem).map((r) => ({ name: r, value: '' })),
    system: '',
  };

  // 分別創建和管理兩個聊天框的狀態
  const [chatBoxA, setChatBoxA] = useState<ChatBox>(chatBoxInitialState);
  const [chatBoxB, setChatBoxB] = useState<ChatBox>(chatBoxInitialState);

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

  // 傳遞訊息的處理函數，包括了請求過程
  const onSendMessage = useCallback(
    async (message: string) => {
      setChatLoading(true);
      const processChat = async (
        chatBox: ChatBox,
        setChatBox: React.Dispatch<React.SetStateAction<ChatBox>>,
      ) => {
        const updatedMessages = [
          ...chatBox.messages,
          new HumanChatMessage(message),
          new AIChatMessage(''),
        ];
        setChatBox((prev) => ({ ...prev, messages: updatedMessages }));

        const response = await sendMessages({
          messages: updatedMessages,
          system: chatBox.system,
          cb: (token: string) => {
            setChatBox((prev) => {
              const lastMessage = prev.messages[prev.messages.length - 1];
              lastMessage.text += token;
              return { ...prev, messages: [...prev.messages] };
            });
          },
        });

        return response;
      };

      try {
        await Promise.all([processChat(chatBoxA, setChatBoxA), processChat(chatBoxB, setChatBoxB)]);
      } catch (error) {
        console.error(error);
      } finally {
        setChatLoading(false);
      }
    },
    [chatBoxA, chatBoxB, sendMessages],
  );

  // 根據參數生成系統的處理函數
  const generateSystem = useCallback(
    async (parameters: parameter[], setChatBox: React.Dispatch<React.SetStateAction<ChatBox>>) => {
      const variables = parameters.reduce(
        (acc, param) => ({ ...acc, [param.name]: param.value }),
        {},
      );
      const system = await makeSystemByTemplate({ prompt: preSystem, variable: variables });
      setChatBox((prev) => ({ ...prev, system }));
    },
    [makeSystemByTemplate, preSystem],
  );

  // 初始生成兩個系統
  useEffect(() => {
    generateSystem(chatBoxA.parameters, setChatBoxA);
    generateSystem(chatBoxB.parameters, setChatBoxB);
  }, [chatBoxA.parameters, chatBoxB.parameters, generateSystem]);

  return (
    <Modal open={open} title="測試聊天機器人" onCancel={close} footer={null} width={1200}>
      <div className="flex">
        <MessageWithParams chatBox={chatBoxA} setChatBox={setChatBoxA} />
        <MessageWithParams chatBox={chatBoxB} setChatBox={setChatBoxB} />
      </div>
      <div className="py-3">
        <Spin spinning={chatLoading}>
          <div className="flex">
            <Button onClick={() => setChatBoxA(chatBoxInitialState)}>Clear</Button>
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
        </Spin>
      </div>
    </Modal>
  );
};

const MessageWithParams = ({
  chatBox,
  setChatBox,
}: {
  chatBox: ChatBox;
  setChatBox: React.Dispatch<React.SetStateAction<ChatBox>>;
}) => {
  const handleParameterChange = useCallback(
    (index: number, value: string) => {
      setChatBox((prev) => {
        const newParameters = [...prev.parameters];
        newParameters[index] = { name: newParameters[index].name, value };
        return { ...prev, parameters: newParameters };
      });
    },
    [setChatBox],
  );

  return (
    <div className="flex-1">
      {chatBox.parameters.map((para, index) => (
        <div className="flex items-center mt-2 space-x-2 border-black border-3">
          <label htmlFor="variableName" className="text-gray-700">
            {para.name}:
          </label>
          <Input
            value={para.value}
            onChange={(e) => handleParameterChange(index, e.target.value)}
          />
        </div>
      ))}
      <Messages messages={chatBox.messages} />
    </div>
  );
};

export default ABTestChat;
