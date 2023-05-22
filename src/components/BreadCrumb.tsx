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
    const breadcrumbItems: BreadcrumbItem[] = [
      {
        title: (
          <Link to="/teams">
            <HomeOutlined />
          </Link>
        ),
      },
    ];

    if (team?.id) {
      breadcrumbItems.push({
        href: `/team/${team.id}`,
        title: team.teamName,
      });
    }

    if (team?.id && project?.id) {
      breadcrumbItems.push({
        href: `/project/${project.id}`,
        title: project.projectName || '',
      });
    }

    setItems(breadcrumbItems);
  }, [team, project]);

  if (isLoading) {
    return null;
  }

  return <Breadcrumb items={items} />;
};

export default BreadCrumb;
