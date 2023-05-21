import * as antd from 'antd';
import React, { useCallback } from 'react';
import { AppContext } from '../AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import ChatsAndMessage from '../components/ChatsAndMessage';
import BreadCrumb from '../components/BreadCrumb';
import AddProject, { ProjectFormData } from '../modals/AddProject';
import { useProject, Project } from '../domains/project';
import { useTeam, IProjectInfo } from '../domains/team';

const auth = getAuth();

const TeamPage = () => {
  const appCtx = React.useContext(AppContext);
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  const { teamId = '' } = useParams();

  const { createProject, delProject, team } = useTeam();

  const init = useCallback(async () => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, navigate, user]);

  React.useEffect(() => {
    init();
  }, [user, init]);

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
      setOpenAddProject(false);

      init();
    }
  };

  const [openAddProject, setOpenAddProject] = React.useState(false);

  const [chatLoading, setLoading] = React.useState(false);

  const { updateProject, sendMessage, project } = useProject();

  // 聊天畫面
  const [searchText, setSearchText] = React.useState('');

  const deletePj = async (project: Project) => {
    const { isDenied } = await Swal.fire({
      title: `Delete Project ${project.projectName}?`,
      showConfirmButton: false,
      showDenyButton: true,
      showCancelButton: true,
      denyButtonText: 'Delete Project',
    });

    if (isDenied) {
      await delProject.mutateAsync({
        teamId: appCtx.teamId || '',
        projectId: project.id || '',
      });
      init();
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

  const chooseProject = async (p: IProjectInfo) => {
    appCtx.setProjectId(p.id);
  };

  const saveChat = async () => {
    await updateProject.mutateAsync({});
  };

  return (
    <>
      <div className="m-2">
        <div className="flex justify-between mb-2">
          <BreadCrumb />
          <antd.Button type="primary" onClick={() => setOpenAddProject(true)}>
            Add
          </antd.Button>
        </div>
        <div>
          <div className="container mx-auto rounded-lg shadow-lg">
            <div className="flex items-center justify-between px-5 py-5 bg-white border-b-2">
              <div className="text-2xl font-semibold">GoingChat</div>
              <div className="w-1/2">
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="search IRL"
                  className="w-full px-5 py-3 bg-gray-100 rounded-2xl"
                />
              </div>
            </div>
            <div className="flex flex-row justify-between bg-white">
              <div className="flex flex-col w-2/5 overflow-y-auto border-r-2">
                <div className="px-2 py-4 border-b-2">
                  <input
                    type="text"
                    placeholder="search chatting"
                    className="w-full px-2 py-2 border-2 border-gray-200 rounded-2xl"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
                {team?.projects
                  ?.filter((p) => p.projectName.includes(searchText))
                  .map((p) => (
                    <div
                      key={p.id}
                      onClick={() => chooseProject(p)}
                      className={`flex flex-row items-center rounded-md my-1 justify-center px-2 py-4 ${
                        project && project.id === p.id
                          ? 'bg-slate-400'
                          : 'hover:bg-slate-200  transition-all duration-200 '
                      } `}
                    >
                      <div className="w-full">
                        <div className="text-lg font-semibold">{p.projectName}</div>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="flex flex-col justify-between w-full px-5">
                {project && (
                  <ChatsAndMessage
                    loading={chatLoading}
                    messages={project.messages || []}
                    onSendMessage={onSendMessage}
                  />
                )}
              </div>
              <div className="w-2/5 px-5 border-l-2">
                {project && (
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <div className="py-4 text-xl font-semibold">{project.projectName}</div>
                      <antd.Button type="primary">
                        <Link to={'/project/' + project.id}>Edit</Link>
                      </antd.Button>
                      <antd.Button type="primary" onClick={saveChat}>
                        保存對話
                      </antd.Button>
                      <antd.Button type="ghost" onClick={() => project && deletePj(project)}>
                        Delete
                      </antd.Button>
                    </div>
                    <div className="my-2">{project.projectDescription}</div>
                    <div className="font-light">system: {project.system}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddProject
        open={openAddProject}
        onCancel={() => setOpenAddProject(false)}
        onOk={addProject}
      />
    </>
  );
};

export default TeamPage;
