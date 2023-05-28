import React from 'react';
import { ReactFlowProvider } from 'reactflow';

import { BreadCrumb } from '../components/BreadCrumb';
import { Flow } from '../components/Flow/Flow';
import ProjectSetting, { ProjectData } from '../components/ProjectSetting';
import { useProject } from '../domains/project';
import { TestChat } from '../modals/TestChat';
import { FlowProvider, FlowContext } from '../components/Flow/FlowContext';

import { FlowToolBox, Tool } from '../components/Flow/FlowToolBox';

const additionalItems = [{ title: <span className="cursor-pointer">project</span> }];

const initialNodes = [
  {
    width: 150,
    height: 40,
    id: '0',
    type: 'input',
    data: { label: '輸入' },
    position: { x: 0, y: 50 },
    positionAbsolute: { x: 0, y: 50 },
  },
  {
    width: 500,
    height: 300,
    id: '2',
    type: 'stepNode',
    data: { content: '這是步驟Node' },
    position: { x: -27, y: 125 },
    positionAbsolute: { x: -27, y: 125 },
  },
  {
    width: 222,
    height: 120,
    id: '3',
    data: { content: '只使用繁體中文回應' },
    position: { x: -35, y: 328 },
    type: 'promptNode',
    positionAbsolute: { x: -35, y: 328 },
  },
  {
    width: 150,
    height: 40,
    id: '1',
    type: 'output',
    data: { label: '輸出' },
    position: { x: 0, y: 488 },
    positionAbsolute: { x: 0, y: 488 },
  },
];

const initialEdges = [
  { source: '0', target: '2', id: '0' },
  { source: '2', target: '3', id: '1' },
  { source: '3', target: '1', id: '2' },
];

const initialViewPort = { x: 768.3185483870968, y: 110.25403225806451, zoom: 1.3024193548387097 };

const Project = () => {
  const flowContext = React.useContext(FlowContext);
  const { updateProject, project } = useProject();

  const onSave = async (projectData: ProjectData) => {
    const flow = flowContext.rfInstance?.toObject();
    if (project) {
      await updateProject.mutateAsync({
        projectName: projectData.projectName,
        projectDescription: projectData.projectDescription,
        apiKey: projectData.openAIKey,
        model: projectData.model,
        chatFlow: flow,
      });
    }
  };

  const tools: Tool[] = [
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
              system: project?.preSystem || '',
            }}
            onSave={onSave}
          />
          <TestChat />
        </div>
      </>
      <FlowToolBox tools={tools} />
      <Flow
        initialNodes={project?.chatFlow?.nodes || initialNodes}
        initialEdges={project?.chatFlow?.edges || initialEdges}
        initialViewport={project?.chatFlow?.viewport || initialViewPort}
      />
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
