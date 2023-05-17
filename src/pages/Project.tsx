import React, { useCallback } from 'react';
import * as antd from 'antd';
import { useParams, Link } from 'react-router-dom';

import { AppContext } from '../AppContext';
import BreadCrumb from '../components/BreadCrumb';

import { getAllProjects, createProject, ProjectService } from '../utils/project';
import { Team, TeamService, createTeam } from '../utils/team';

const Project = () => {
  const appCtx = React.useContext(AppContext);

  const { projectId = '' } = useParams();

  const init = async () => {
    const p = new ProjectService(appCtx.teamService?.getTeam().id || '', projectId);
    await p.init();
    console.log({ p });

    appCtx.setProjectService(p);

    // TODO: 刪除
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.project = p;
  };

  React.useEffect(() => {
    init();
  }, []);

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
              {
                href: `/project/${projectId}`,
                title: appCtx.projectService?.getProject().projectName || '',
              },
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default Project;
