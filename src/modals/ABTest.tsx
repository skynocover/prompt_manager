import React from 'react';
import { Modal, Button } from 'antd';
import * as antd from 'antd';

import { HumanChatMessage, BaseChatMessage, AIChatMessage } from 'langchain/schema';
import { useProject } from '../domains/project';
import { Messages } from '../components/Messages';
import { parameter, extractSubstrings } from '../components/SystemParameters';

interface ProjectModalProps {
  open: boolean;
  close: () => void;
  preSystem: string;
}

export const ABTestChat = ({ preSystem }: { preSystem: string }) => {
  const [openChat, setOpenChat] = React.useState(false);

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
  const [chatLoading, setLoading] = React.useState(false);

  const [messagesA, setMessagesA] = React.useState<BaseChatMessage[]>([]);
  const [parametersA, setParametersA] = React.useState<parameter[]>([]);
  const [systemA, setSystemA] = React.useState('');

  const [messagesB, setMessagesB] = React.useState<BaseChatMessage[]>([]);
  const [parametersB, setParametersB] = React.useState<parameter[]>([]);
  const [systemB, setSystemB] = React.useState('');
  const { makeSystemByTemplate } = useProject();

  const { sendMessages } = useProject();

  React.useEffect(() => {
    const result = extractSubstrings(preSystem);
    setParametersA(
      result.map((r) => {
        return { name: r, value: '' };
      }),
    );
    setParametersB(
      result.map((r) => {
        return { name: r, value: '' };
      }),
    );
  }, [preSystem]);

  const makeSystemA = React.useCallback(async () => {
    const temp: { [key: string]: string } = {};
    parametersA.forEach((param) => {
      temp[param.name] = param.value;
    });
    const v = await makeSystemByTemplate({ prompt: preSystem, variable: temp });
    setSystemA(v);
  }, [preSystem, parametersA, makeSystemByTemplate, setSystemA]);

  React.useEffect(() => {
    makeSystemA();
  }, [makeSystemA]);

  const makeSystemB = React.useCallback(async () => {
    const temp: { [key: string]: string } = {};
    parametersB.forEach((param) => {
      temp[param.name] = param.value;
    });
    const v = await makeSystemByTemplate({ prompt: preSystem, variable: temp });
    setSystemB(v);
  }, [preSystem, parametersB, makeSystemByTemplate, setSystemB]);

  React.useEffect(() => {
    makeSystemB();
  }, [makeSystemB]);

  const onSendMessage = async (message: string) => {
    setLoading(true);
    try {
      setMessagesA([...messagesA, new HumanChatMessage(message), new AIChatMessage('')]);
      sendMessages.mutateAsync({
        messages: [...messagesA, new HumanChatMessage(message)],
        system: systemA,
        cb: (token: string) => {
          setMessagesA((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages[updatedMessages.length - 1] = new AIChatMessage(
              updatedMessages[updatedMessages.length - 1].text + token,
            );
            return updatedMessages;
          });
        },
      });
      setMessagesB([...messagesB, new HumanChatMessage(message), new AIChatMessage('')]);
      sendMessages.mutateAsync({
        messages: [...messagesB, new HumanChatMessage(message)],
        system: systemB,
        cb: (token: string) => {
          setMessagesB((prevMessages) => {
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

  const [message, setMessage] = React.useState('');
  const [isComposing, setIsComposing] = React.useState(false);

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
    <Modal open={open} title="測試聊天機器人" onCancel={close} footer={null} width={1200}>
      <div className="flex">
        <MessageWithParams
          parameters={parametersA}
          messages={messagesA}
          setParameters={setParametersA}
        />
        <MessageWithParams
          parameters={parametersB}
          messages={messagesB}
          setParameters={setParametersB}
        />
      </div>

      <div className="py-3">
        <antd.Spin spinning={chatLoading}>
          <div className="flex">
            <div
              className="flex items-center justify-center w-1/6 mr-2 bg-red-400 rounded-md"
              onClick={() => setMessagesA([])}
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
    </Modal>
  );
};

const MessageWithParams = ({
  parameters,
  setParameters,
  messages,
}: {
  parameters: parameter[];
  setParameters: React.Dispatch<React.SetStateAction<parameter[]>>;
  messages: BaseChatMessage[];
}) => {
  const handleParameterChange = React.useCallback(
    (index: number, value: string) => {
      setParameters((prev) => {
        const temp = [...prev];
        temp[index] = { name: temp[index].name, value };
        return temp;
      });
    },
    [setParameters],
  );

  return (
    <>
      <div className="flex-1">
        <div className="">
          {parameters.map((para, index) => (
            <div className="flex items-center mt-2 space-x-2 border-black border-3">
              <label htmlFor="variableName" className="text-gray-700">
                {para.name}:
              </label>
              <antd.Input
                value={para.value}
                onChange={(e) => handleParameterChange(index, e.target.value)}
              />
            </div>
          ))}
          <Messages messages={messages} />
        </div>
      </div>
    </>
  );
};
