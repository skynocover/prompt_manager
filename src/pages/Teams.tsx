import * as antd from 'antd';
import React, { useCallback } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

import { useTeams, Team } from '../domains/teams';

const auth = getAuth();

const Teams = () => {
  const navigate = useNavigate();

  const { teams, createTeam, delTeam } = useTeams();

  const [user, loading] = useAuthState(auth);

  const init = useCallback(async () => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, navigate, loading]);

  React.useEffect(() => {
    init();
  }, [user, init]);

  const addTeam = async () => {
    const teamName = prompt('Enter the teamName name');

    if (user && teamName) {
      await createTeam.mutateAsync({ teamName });
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
      await delTeam.mutateAsync(team.id);
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
          dataSource={teams?.map((team) => {
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
