import React from 'react';
import { Modal, Button } from 'antd';
import { HumanChatMessage, BaseChatMessage, AIChatMessage } from 'langchain/schema';

import { FlowContext } from '../components/Flow/FlowContext';
import { ChatInput } from '../components/Chat/ChatInput';
import { Messages } from '../components/Chat/Messages';
import { useProject } from '../domains/project';

interface ProjectModalProps {
  open: boolean;
  close: () => void;
  system?: string;
}

export const TestChat = ({ system }: { system?: string }) => {
  const [openChat, setOpenChat] = React.useState(false);

  return (
    <>
      <Button type="primary" onClick={() => setOpenChat(true)}>
        Test Chat
      </Button>
      <ChatModal system={system} open={openChat} close={() => setOpenChat(false)} />
    </>
  );
};
const ChatModal: React.FC<ProjectModalProps> = ({ open, close, system }) => {
  const { nodes } = React.useContext(FlowContext);
  const [chatLoading, setLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<BaseChatMessage[]>([]);

  const { sendMessages } = useProject();

  const onSendMessage = async (message: string) => {
    setLoading(true);
    try {
      setMessages([...messages, new HumanChatMessage(message), new AIChatMessage('')]);
      await sendMessages({
        messages: [...messages, new HumanChatMessage(message)],
        system,
        cb: (token: string) => {
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages[updatedMessages.length - 1] = new AIChatMessage(
              updatedMessages[updatedMessages.length - 1].text + token,
            );
            return updatedMessages;
          });
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} title="測試聊天機器人" onCancel={close} footer={null} width={800}>
      <div className="h-[750px] flex flex-col">
        <Messages
          messages={messages}
          responseType={nodes.find((item) => item.type === 'outputNode')?.data.chartType}
        />
        <ChatInput
          loading={chatLoading}
          onSendMessage={onSendMessage}
          clear={() => setMessages([])}
        />
      </div>
    </Modal>
  );
};
