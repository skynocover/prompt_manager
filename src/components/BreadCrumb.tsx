import React from 'react';
import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../domains/project';
import { useTeam } from '../domains/team';

interface BreadcrumbItem {
  title: React.ReactNode;
}

const BreadCrumb = ({ additionalItems }: { additionalItems?: BreadcrumbItem[] }) => {
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
        title: (
          <span className="cursor-pointer" onClick={() => navigate(`/team/${team.id}`)}>
            {team.teamName}
          </span>
        ),
      });
    }

    if (team?.id && project?.id) {
      breadcrumbItems.push({
        title: (
          <span className="cursor-pointer" onClick={() => navigate(`/team/${team.id}`)}>
            {project.projectName || ''}
          </span>
        ),
      });
    }

    if (additionalItems) {
      additionalItems.map((item) => {
        breadcrumbItems.push(item);
      });
    }

    setItems(breadcrumbItems);
  }, [team, project, navigate, additionalItems]);

  return <Breadcrumb items={items} />;
};

export default BreadCrumb;
