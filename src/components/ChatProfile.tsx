import React from 'react';
import * as antd from 'antd';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import { AppContext } from '../AppContext';
import { useTeam } from '../domains/team';
import { useProject, Project } from '../domains/project';

const ChatProfile = () => {
  const appCtx = React.useContext(AppContext);
  const navigate = useNavigate();

  const { project } = useProject();
  const { delProject } = useTeam();

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
    }
  };

  return (
    <>
      <div className="w-2/5 px-5 border-l-2">
        {project && (
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <div className="py-4 text-xl font-semibold">{project.projectName}</div>
              <antd.Button type="primary" onClick={() => navigate(`chat`)}>
                Edit Chat
              </antd.Button>

              <antd.Button type="ghost" onClick={() => deletePj(project)}>
                Delete
              </antd.Button>
            </div>
            <div className="my-2">{project.projectDescription}</div>
            <div className="p-2 font-light rounded-md bg-slate-300">
              <antd.Button type="primary" onClick={() => navigate(`system`)}>
                Edit System
              </antd.Button>
              <p>system: {project.system}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatProfile;
