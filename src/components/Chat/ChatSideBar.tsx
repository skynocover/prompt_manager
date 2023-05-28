import React from 'react';
import { AppContext } from '../../AppContext';
import { useTeam, IProjectInfo } from '../../domains/team';
import { useProject } from '../../domains/project';

export const ChatSideBar = () => {
  const appCtx = React.useContext(AppContext);
  const [searchText, setSearchText] = React.useState('');
  const { projects } = useTeam();
  const { project } = useProject();
  const chooseProject = async (p: IProjectInfo) => {
    appCtx.setProjectId(p.id);
  };
  return (
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
      {projects
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
  );
};
