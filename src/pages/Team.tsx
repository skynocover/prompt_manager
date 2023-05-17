import * as antd from 'antd';
import React, { useCallback } from 'react';
import { AppContext } from '../AppContext';
import { Link } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

import { Project, getAllProjects, createProject, deleteProject } from '../utils/project';
import { TeamService } from '../utils/team';
import BreadCrumb from '../components/BreadCrumb';

const TeamPage = () => {
  const appCtx = React.useContext(AppContext);
  const navigate = useNavigate();

  const { teamId = '' } = useParams();

  const [projects, setProjects] = React.useState<Project[]>([]);

  const init = useCallback(async () => {
    if (appCtx.user) {
      const team = new TeamService(teamId);
      await team.init();
      appCtx.setTeamService(team);

      const projects = await getAllProjects(teamId);
      setProjects(projects);
    } else {
      navigate('/login');
    }
  }, [appCtx, navigate, teamId]);

  React.useEffect(() => {
    init();
  }, [appCtx.user, init]);

  const addProject = async () => {
    const projectName = prompt('Enter the project name');

    if (appCtx.user && projectName) {
      await createProject(appCtx.user.email || '', teamId, projectName);

      init();
    }
  };

  const deletePj = async (project: Project) => {
    const { isDenied } = await Swal.fire({
      title: `Delete Project ${project.projectName}?`,
      showConfirmButton: false,
      showDenyButton: true,
      showCancelButton: true,
      denyButtonText: 'Delete Project',
    });

    if (isDenied) {
      await deleteProject(teamId, project.id);
      init();
    }
  };

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
          <antd.Button type="primary" onClick={addProject}>
            Add
          </antd.Button>
        </div>
        <div className="bg-slate-500">
          <antd.Row gutter={16} className="p-2">
            {projects.map((p) => (
              <antd.Col span={8} className="p-2">
                <antd.Card title={p.projectName}>
                  <antd.Button type="primary">
                    <Link to={'/project/' + p.id}>Edit</Link>
                  </antd.Button>
                  <antd.Button type="ghost" onClick={() => deletePj(p)}>
                    Delete
                  </antd.Button>
                </antd.Card>
              </antd.Col>
            ))}
          </antd.Row>
        </div>
      </div>
    </>
  );
};

export default TeamPage;
