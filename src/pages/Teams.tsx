import * as antd from 'antd';
import React, { useCallback } from 'react';
import Swal from 'sweetalert2';
import { AppContext } from '../AppContext';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { Team, getAllTeams, createTeam, TeamService } from '../utils/team';

const Teams = () => {
  const appCtx = React.useContext(AppContext);
  const navigate = useNavigate();
  const [teams, setTeams] = React.useState<Team[]>([]);

  const init = useCallback(async () => {
    if (appCtx.user) {
      const teams = await getAllTeams(appCtx.user.email || '');
      setTeams(teams);
    } else {
      navigate('/login');
    }
  }, [appCtx.user, navigate]);

  React.useEffect(() => {
    init();
  }, [appCtx.user, init]);

  const addTeam = async () => {
    const projectName = prompt('Enter the project name');

    if (appCtx.user && projectName) {
      await createTeam(appCtx.user.email || '', projectName);

      init();
    }
  };

  const deleteTeam = async (team: Team) => {
    const { isDenied } = await Swal.fire({
      title: `Delete Team ${team.teamName}?`,
      showConfirmButton: false,
      showDenyButton: true,
      showCancelButton: true,
      denyButtonText: 'Delete Project',
    });

    if (isDenied) {
      const teamService = new TeamService(team.id);
      await teamService.delete();
      init();
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'teamName',
      key: 'teamName',
    },
    {
      title: 'Action',
      key: 'x',
      render: (team: Team) => (
        <div className="flex space-x-2">
          <antd.Button type="primary">
            <Link to={'/team/' + team.id}>Edit</Link>
          </antd.Button>
          <antd.Button type="ghost" onClick={() => deleteTeam(team)}>
            Delete
          </antd.Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="m-2">
        <div className="flex justify-end mb-2">
          <antd.Button type="primary" onClick={addTeam}>
            Add
          </antd.Button>
        </div>
        <antd.Table
          scroll={{ x: 800 }}
          dataSource={teams.map((team) => {
            return { key: team.id, ...team };
          })}
          columns={columns}
          pagination={false}
        />
      </div>
    </>
  );
};

export default Teams;
