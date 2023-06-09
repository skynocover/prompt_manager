import React, { useCallback, useEffect, useState } from 'react';
import { Button, Modal, Spin, Input } from 'antd';
import { BaseChatMessage, HumanChatMessage, AIChatMessage } from 'langchain/schema';

import { FlowContext } from '../components/Flow/FlowContext';
import { useProject } from '../domains/project';
import { Messages } from '../components/Chat/Messages';
import { parameter } from '../components/Chat/SystemParameters';
import { extractSubstrings } from '../utils/handleStr';

interface ProjectModalProps {
  open: boolean;
  close: () => void;
  preSystem: string;
}

// 定義 ChatBox 介面，包括三個屬性：訊息、參數和系統
interface ChatBox {
  messages: BaseChatMessage[];
  parameters: parameter[];
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
  const { nodes } = React.useContext(FlowContext);
  const { makeSystemByTemplate, sendMessages } = useProject();

  // 狀態控制
  const [message, setMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  // 初始化聊天框狀態
  const chatBoxInitialState = {
    messages: [],
    parameters: [],
    system: '',
  };

  useEffect(() => {
    setChatBoxA({
      messages: [],
      parameters: extractSubstrings(preSystem).map((r) => ({ name: r, value: '' })),
    });
    setChatBoxB({
      messages: [],
      parameters: extractSubstrings(preSystem).map((r) => ({ name: r, value: '' })),
    });
  }, [preSystem]);

  // 分別創建和管理兩個聊天框的狀態
  const [chatBoxA, setChatBoxA] = useState<ChatBox>(chatBoxInitialState);
  const [systemA, setSystemA] = useState('');
  const [chatBoxB, setChatBoxB] = useState<ChatBox>(chatBoxInitialState);
  const [systemB, setSystemB] = useState('');

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
        system: string,
      ) => {
        const updatedMessages = [
          ...chatBox.messages,
          new HumanChatMessage(message),
          new AIChatMessage(''),
        ];
        setChatBox((prev) => ({ ...prev, messages: updatedMessages }));

        const response = await sendMessages({
          messages: updatedMessages,
          system: system,
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
        await Promise.all([
          processChat(chatBoxA, setChatBoxA, systemA),
          processChat(chatBoxB, setChatBoxB, systemB),
        ]);
      } catch (error) {
        console.error(error);
      } finally {
        setChatLoading(false);
      }
    },
    [chatBoxA, chatBoxB, sendMessages, systemA, systemB],
  );

  // 根據參數生成系統的處理函數
  const generateSystem = useCallback(
    async (parameters: parameter[], setSystem: React.Dispatch<React.SetStateAction<string>>) => {
      const variables = parameters.reduce(
        (acc, param) => ({ ...acc, [param.name]: param.value }),
        {},
      );
      const system = await makeSystemByTemplate({ prompt: preSystem, variable: variables });
      setSystem(system);
    },
    [makeSystemByTemplate, preSystem],
  );

  //初始生成兩個系統
  useEffect(() => {
    generateSystem(chatBoxA.parameters, setSystemA);
    generateSystem(chatBoxB.parameters, setSystemB);
  }, [preSystem, chatBoxA.parameters, chatBoxB.parameters, generateSystem]);

  const clearChat = () => {
    setChatBoxA((prev) => {
      return { ...prev, messages: [] };
    });
    setChatBoxB((prev) => {
      return { ...prev, messages: [] };
    });
  };

  return (
    <Modal open={open} title="測試聊天機器人" onCancel={close} footer={null} width={1200}>
      <div className="flex space-x-4">
        <MessageWithParams
          chatBox={chatBoxA}
          setChatBox={setChatBoxA}
          responseType={nodes.find((item) => item.type === 'outputNode')?.data.chartType}
        />
        <MessageWithParams
          chatBox={chatBoxB}
          setChatBox={setChatBoxB}
          responseType={nodes.find((item) => item.type === 'outputNode')?.data.chartType}
        />
      </div>
      <div className="py-3">
        <Spin spinning={chatLoading}>
          <div className="flex ">
            <div
              className="flex items-center justify-center w-1/6 mr-2 bg-red-400 rounded-md"
              onClick={clearChat}
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
        </Spin>
      </div>
    </Modal>
  );
};

const MessageWithParams = ({
  chatBox,
  setChatBox,
  responseType,
}: {
  chatBox: ChatBox;
  setChatBox: React.Dispatch<React.SetStateAction<ChatBox>>;
  responseType: string;
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
        <div key={index} className="flex items-center mt-2 space-x-2 border-black border-3">
          <label htmlFor="variableName" className="text-gray-700">
            {para.name}:
          </label>
          <Input
            value={para.value}
            onChange={(e) => handleParameterChange(index, e.target.value)}
          />
        </div>
      ))}
      <Messages messages={chatBox.messages} responseType={responseType} />
    </div>
  );
};

export default ABTestChat;
