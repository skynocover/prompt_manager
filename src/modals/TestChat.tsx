import React from 'react';
import { Modal, Button } from 'antd';

import { HumanChatMessage, BaseChatMessage, SystemChatMessage } from 'langchain/schema';
import ChatsAndMessage from '../components/ChatsAndMessage';
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
  const [chatLoading, setLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<BaseChatMessage[]>([]);
  const [temp, setTemp] = React.useState('');

  const { sendMessages } = useProject();

  const onSendMessage = async (message: string) => {
    setLoading(true);
    try {
      setMessages([...messages, new HumanChatMessage(message), new SystemChatMessage('')]);
      const resp = await sendMessages.mutateAsync({
        messages: [...messages, new HumanChatMessage(message)],
        system,
        cb: (token: string) => {
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages[updatedMessages.length - 1] = new SystemChatMessage(
              updatedMessages[updatedMessages.length - 1].text + token,
            );
            return updatedMessages;
          });
          setTemp((prev) => prev + token);
        },
      });
      if (resp) {
        setMessages([...messages, new HumanChatMessage(message), resp]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} title="測試聊天機器人" onCancel={close} footer={null}>
      <ChatsAndMessage
        loading={chatLoading}
        messages={messages}
        onSendMessage={onSendMessage}
        clear={() => setMessages([])}
      />
      {temp}
    </Modal>
  );
};
