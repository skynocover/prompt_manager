import * as antd from 'antd';
import React, { useCallback } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

import { Team, getAllTeams, createTeam, TeamService } from '../utils/team';

const auth = getAuth();

const Teams = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = React.useState<Team[]>([]);

  const [user] = useAuthState(auth);

  const init = useCallback(async () => {
    if (user) {
      const teams = await getAllTeams(user.email || '');
      setTeams(teams);
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  React.useEffect(() => {
    init();
  }, [user, init]);

  const addTeam = async () => {
    const projectName = prompt('Enter the project name');

    if (user && projectName) {
      await createTeam(user.email || '', projectName);

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
