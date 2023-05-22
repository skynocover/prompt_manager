import React from 'react';
import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../domains/project';
import { useTeam } from '../domains/team';

interface BreadcrumbItem {
  to?: string;
  title: React.ReactNode;
}

const BreadCrumb = () => {
  const { team } = useTeam();
  const { project } = useProject();
  const navigate = useNavigate();

  const [items, setItems] = React.useState<BreadcrumbItem[]>([]);

  React.useEffect(() => {
    const breadcrumbItems: BreadcrumbItem[] = [
      {
        title: (
          <span className="cursor-pointer" onClick={() => navigate('/teams')}>
            <HomeOutlined />
          </span>
        ),
      },
    ];

    if (team?.id) {
      breadcrumbItems.push({
        to: `/team/${team.id}`,
        title: (
          <span className="cursor-pointer" onClick={() => navigate(`/team/${team.id}`)}>
            {team.teamName}
          </span>
        ),
      });
    }

    if (team?.id && project?.id) {
      breadcrumbItems.push({
        to: `/project/${project.id}`,
        title: (
          <span className="cursor-pointer" onClick={() => navigate(`/project/${project.id}`)}>
            {project.projectName || ''}
          </span>
        ),
      });
    }

    setItems(breadcrumbItems);
  }, [team, project, navigate]);

  return <Breadcrumb items={items} />;
};

export default BreadCrumb;
