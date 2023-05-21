import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

import { AppContext } from '../AppContext';
import ChatsAndMessage from '../components/ChatsAndMessage';
import BreadCrumb from '../components/BreadCrumb';
import { AddProject, ProjectFormData } from '../modals/AddProject';
import { useProject } from '../domains/project';
import { useTeam } from '../domains/team';
import ChatSideBar from '../components/ChatSideBar';
import ChatProfile from '../components/ChatProfile';

const auth = getAuth();

const TeamPage = () => {
  const appCtx = React.useContext(AppContext);
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  const { teamId = '' } = useParams();

  const { createProject } = useTeam();
  const { sendMessage, project } = useProject();

  const [chatLoading, setLoading] = React.useState(false);

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
      await createProject.mutateAsync({
        teamId,
        projectName: projectFormData.projectName,
        projectDescription: projectFormData.projectDescription,
      });
    }
  };

  const onSendMessage = async (message: string) => {
    setLoading(true);
    try {
      await sendMessage.mutateAsync(message);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
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
                {project && (
                  <ChatsAndMessage
                    loading={chatLoading}
                    messages={project.messages || []}
                    onSendMessage={onSendMessage}
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
