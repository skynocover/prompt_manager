import React from 'react';
import { Modal, Button } from 'antd';
import { ChatCompletionRequestMessage } from 'openai';

import ChatsAndMessage from '../components/ChatsAndMessage';
import { useProject } from '../domains/project';

interface ProjectModalProps {
  open: boolean;
  close: () => void;
}

export const TestChat = () => {
  const [openChat, setOpenChat] = React.useState(false);

  return (
    <>
      <Button type="primary" onClick={() => setOpenChat(true)}>
        Test Chat
      </Button>
      <ChatModal open={openChat} close={() => setOpenChat(false)} />
    </>
  );
};

const ChatModal: React.FC<ProjectModalProps> = ({ open, close }) => {
  const [chatLoading, setLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatCompletionRequestMessage[]>([]);

  const { sendMessages } = useProject();

  const onSendMessage = async (message: string) => {
    setLoading(true);
    try {
      setMessages([...messages, { role: 'user', content: message }]);
      const resp = await sendMessages.mutateAsync({
        messages: [...messages, { role: 'user', content: message }],
      });
      if (resp) {
        setMessages([...messages, { role: 'user', content: message }, resp]);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <Modal open={open} title="測試聊天機器人" onCancel={close} footer={null}>
      <ChatsAndMessage loading={chatLoading} messages={messages} onSendMessage={onSendMessage} />
    </Modal>
  );
};
