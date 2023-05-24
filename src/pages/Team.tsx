import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as antd from 'antd';
import { useAuthState } from 'react-firebase-hooks/auth';
import { HumanChatMessage, BaseChatMessage, AIChatMessage } from 'langchain/schema';

import { AppContext } from '../AppContext';
import ChatsAndMessage from '../components/ChatsAndMessage';
import BreadCrumb from '../components/BreadCrumb';
import { AddProject } from '../modals/AddProject';
import { useProject } from '../domains/project';
import { useTeam, ProjectFormData } from '../domains/team';
import ChatSideBar from '../components/ChatSideBar';
import ChatProfile from '../components/ChatProfile';
import { auth } from '../utils/firebase';

const TeamPage = () => {
  const appCtx = React.useContext(AppContext);
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  const { teamId = '' } = useParams();

  const { createProject } = useTeam();
  const { sendMessages, project, updateProject } = useProject();

  const [chatLoading, setLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<BaseChatMessage[]>([]);

  React.useEffect(() => {
    if (project?.messages) {
      setMessages(project.messages);
    } else if (project) {
      setMessages([]);
    }
  }, [project]);

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, navigate, user]);

  React.useEffect(() => {
    if (teamId) {
      appCtx.setTeamId(teamId);
    }
  }, [teamId]);

  const addProject = async (projectFormData: ProjectFormData) => {
    if (user && projectFormData.projectName) {
      await createProject.mutateAsync({ teamId, projectFormData });
    }
  };

  const onSendMessage = async (message: string) => {
    setLoading(true);
    try {
      setMessages([...messages, new HumanChatMessage(message), new AIChatMessage('')]);
      await sendMessages.mutateAsync({
        messages: [...messages, new HumanChatMessage(message)],
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
    }
    setLoading(false);
  };

  const saveChat = async () => {
    await updateProject.mutateAsync({ messages });
  };

  return (
    <>
      <div className="m-2">
        <div className="flex justify-between mb-2">
          <BreadCrumb />
          <AddProject onOk={addProject} />
        </div>
        <div>
          <div className="container mx-auto rounded-lg shadow-lg">
            <div className="flex items-center justify-between px-5 py-5 bg-white border-b-2">
              <div className="text-2xl font-semibold">GoingChat</div>
            </div>
            <div className="flex flex-row justify-between bg-white">
              <ChatSideBar />

              <div className="flex flex-col justify-between w-full px-5">
                <div className="flex justify-end">
                  <antd.Button disabled={chatLoading} type="primary" onClick={saveChat}>
                    保存對話
                  </antd.Button>
                </div>
                {project && (
                  <ChatsAndMessage
                    loading={chatLoading}
                    messages={messages}
                    onSendMessage={onSendMessage}
                    clear={() => setMessages([])}
                  />
                )}
              </div>
              <ChatProfile />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamPage;
