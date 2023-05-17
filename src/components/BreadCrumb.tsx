import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';

interface Path {
  href: string;
  title: string;
}

const BreadCrumb = ({ paths }: { paths: Path[] }) => {
  return (
    <Breadcrumb
      items={[
        {
          title: (
            <Link to="/teams">
              <HomeOutlined />
            </Link>
          ),
        },
        ...paths.map((path) => {
          return {
            title: <Link to={path.href}>{path.title}</Link>,
          };
        }),
      ]}
    />
  );
};

export default BreadCrumb;
