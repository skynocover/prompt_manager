import React from 'react';
import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { useProject } from '../domains/project';
import { useTeam } from '../domains/team';

interface BreadcrumbItem {
  href?: string;
  title: React.ReactNode;
}

const BreadCrumb = () => {
  const { isLoading, team } = useTeam();
  const { project } = useProject();

  const [items, setItems] = React.useState<BreadcrumbItem[]>([
    {
      title: (
        <Link to="/teams">
          <HomeOutlined />
        </Link>
      ),
    },
  ]);

  React.useEffect(() => {
    if (team?.id) {
      setItems([
        {
          title: (
            <Link to="/teams">
              <HomeOutlined />
            </Link>
          ),
        },
        {
          href: `/team/${team.id}`,
          title: team.teamName,
        },
      ]);
    }

    if (team?.id && project?.id) {
      setItems([
        {
          title: (
            <Link to="/teams">
              <HomeOutlined />
            </Link>
          ),
        },
        {
          href: `/team/${team.id}`,
          title: team.teamName,
        },
        {
          href: `/project/${project.id}`,
          title: project?.projectName || '',
        },
      ]);
    }
  }, [team, project]);

  if (isLoading) {
    return <></>;
  }

  return <Breadcrumb items={items} />;
};

export default BreadCrumb;
