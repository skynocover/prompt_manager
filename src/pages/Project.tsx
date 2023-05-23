import React from 'react';
import { Node, Edge, ReactFlowProvider } from 'reactflow';

import BreadCrumb from '../components/BreadCrumb';
import Flow from '../components/Flow';
import ProjectSetting, { ProjectData } from '../components/ProjectSetting';
import { useProject } from '../domains/project';
import { TestChat } from '../modals/TestChat';
import { FlowProvider, FlowContext } from '../components/FlowContext';

import { findNodePath } from '../utils/findNodePath';
import { FlowToolBox, Tool } from '../components/FlowToolBox';

const additionalItems = [{ title: <span className="cursor-pointer">project</span> }];

const initialNodes = [
  {
    id: '0',
    type: 'systemNode',
    data: { label: '輸入' },
    position: { x: 0, y: 50 },
    width: 150,
    height: 40,
  },
  {
    id: '1',
    type: 'output',
    data: { label: '輸出' },
    position: { x: 0, y: 200 },
    width: 150,
    height: 40,
  },
  {
    id: '2',
    type: 'stepNode',
    data: { label: '這是步驟Node' },
    position: { x: 0, y: 400 },
    width: 500,
    height: 300,
  },
  {
    id: '3',
    type: 'promptNode',
    data: { label: 'Prompt' },
    position: { x: 200, y: 300 },
    width: 500,
    height: 300,
  },
];

const Project = () => {
  const flowContext = React.useContext(FlowContext);
  const { updateProject, project } = useProject();

  const onSave = async (projectData: ProjectData) => {
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
        <BreadCrumb additionalItems={additionalItems} />
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
      <Flow initialNodes={initialNodes} />
    </>
  );
};

export const ProjectPage = () => {
  return (
    <ReactFlowProvider>
      <FlowProvider>
        <Project />
      </FlowProvider>
    </ReactFlowProvider>
  );
};
