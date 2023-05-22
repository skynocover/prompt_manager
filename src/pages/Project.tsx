import React from 'react';
import BreadCrumb from '../components/BreadCrumb';
import Flow from '../components/Flow';
import ProjectSetting, { ProjectData } from '../components/ProjectSetting';
import { useProject } from '../domains/project';
import { TestChat } from '../modals/TestChat';
import { FlowContext } from '../components/FlowContext';

import { findNodePath } from '../utils/findNodePath';
import { FlowToolBox, Tool } from '../components/FlowToolBox';

const ProjectPage = () => {
  const flowContext = React.useContext(FlowContext);
  const { updateProject, project } = useProject();

  const onSave = async (projectData: ProjectData) => {
    // const flow = flowContext.rfInstance?.toObject();
    // if (flow) {
    //   const path = findNodePath(flow);
    //   console.log({ path });
    // }

    if (project) {
      await updateProject.mutateAsync({
        projectName: projectData.projectName,
        projectDescription: projectData.projectDescription,
        apiKey: projectData.openAIKey,
        model: projectData.model,
        system: projectData.system,
      });
    }
  };

  const tools: Tool[] = [
    { title: 'Node', type: 'default' },
    { title: 'Step Node', type: 'stepNode' },
    { title: 'Prompt Node', type: 'promptNode' },
    { title: 'Detail', type: 'promptNode', content: '回答時盡量詳細' },
    { title: 'Code Only', type: 'promptNode', content: '只回應我程式碼的部分' },
    { title: 'Traditional Chinese', type: 'promptNode', content: '只使用繁體中文回應' },
    { title: 'Example', type: 'promptNode', content: '請舉例說明' },
  ];

  return (
    <>
      <div className="fixed left-0 z-20 flex justify-between p-2 bg-white">
        <BreadCrumb />
      </div>
      <>
        <div className="fixed right-0 z-20 p-3 -translate-y-1/2 bg-white rounded-md top-1/2">
          <ProjectSetting
            projectData={{
              projectName: project?.projectName || '',
              projectDescription: project?.projectDescription || '',
              openAIKey: project?.apiKey || '',
              model: project?.model || '',
              system: project?.system || '',
            }}
            onSave={onSave}
          />
          <TestChat />
        </div>
      </>
      <FlowToolBox tools={tools} />
      <Flow />
    </>
  );
};

export default ProjectPage;
