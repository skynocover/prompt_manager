import * as antd from 'antd';
import React, { useCallback } from 'react';
import { AppContext } from '../AppContext';
import { Link } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

import {
  Project,
  getAllProjects,
  createProject,
  deleteProject,
  IProjectInfo,
} from '../utils/project';
import { TeamService } from '../utils/team';
import BreadCrumb from '../components/BreadCrumb';
import Chat from '../components/Chat';
import AddProject, { ProjectFormData } from '../modals/AddProject';

const auth = getAuth();

const TeamPage = () => {
  const appCtx = React.useContext(AppContext);
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const { teamId = '' } = useParams();

  const [projects, setProjects] = React.useState<IProjectInfo[]>([]);

  const init = useCallback(async () => {
    if (user) {
      const team = new TeamService(teamId);
      await team.init();
      appCtx.setTeamService(team);
      const projects = await getAllProjects(teamId);
      setProjects(projects);
    } else {
      navigate('/login');
    }
    // TODO: Check appCtx
  }, [navigate, teamId, user]);

  React.useEffect(() => {
    init();
  }, [user, init]);

  const addProject = async (projectFormData: ProjectFormData) => {
    // const projectName = prompt('Enter the project name');

    if (user && projectFormData.projectName) {
      const projectId = await createProject(
        user.email || '',
        teamId,
        projectFormData.projectName,
        projectFormData.projectDescription,
      );
      const project = new Project(teamId, projectId);
      await project.init();
      await project.updateOpenAI({
        apiKey: projectFormData.openAIKey || '',
        model: projectFormData.model || '',
        system: projectFormData.system,
        messages: [],
      });

      setOpenAddProject(false);

      init();
    }
  };

  const [openAddProject, setOpenAddProject] = React.useState(false);

  return (
    <>
      <div className="m-2">
        <div className="flex justify-between mb-2">
          <BreadCrumb
            paths={[
              {
                href: `/team/${appCtx.teamService?.getTeam().id}`,
                title: appCtx.teamService?.getTeam().teamName || '',
              },
            ]}
          />
          <antd.Button type="primary" onClick={() => setOpenAddProject(true)}>
            Add
          </antd.Button>
        </div>
        <Chat projects={projects} refresh={init} />
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
