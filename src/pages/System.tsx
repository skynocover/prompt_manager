import React, { useCallback } from 'react';
import { Input, Button } from 'antd';
import { ReactFlowProvider } from 'reactflow';
import { SystemMessagePromptTemplate, ChatPromptTemplate } from 'langchain/prompts';

import BreadCrumb from '../components/BreadCrumb';
import Flow from '../components/Flow';
import { useProject } from '../domains/project';
import { TestChat } from '../modals/TestChat';
import { FlowProvider, FlowContext } from '../components/FlowContext';

import { findNodePath } from '../utils/findNodePath';
import { FlowToolBox, Tool } from '../components/FlowToolBox';

const initialNodes = [
  {
    width: 150,
    height: 36,
    id: '0',
    type: 'input',
    data: { label: '輸入' },
    position: { x: 81, y: -37 },
    positionAbsolute: { x: 81, y: -37 },
    selected: false,
    dragging: false,
  },
  {
    width: 150,
    height: 36,
    id: '1',
    type: 'output',
    data: { label: '輸出' },
    position: { x: 136, y: 721 },
    positionAbsolute: { x: 136, y: 721 },
    selected: false,
    dragging: false,
  },
  {
    width: 288,
    height: 156,
    id: '3',
    type: 'variableNode',
    data: { name: '等級', content: '初學者' },
    position: { x: 206, y: 262 },
    positionAbsolute: { x: 206, y: 262 },
    selected: false,
    dragging: false,
  },
  {
    width: 217,
    height: 149,
    id: '4',
    type: 'promptNode',
    data: { content: '請給我推薦適合{等級}的{主題}' },
    position: { x: 240, y: 468 },
    positionAbsolute: { x: 240, y: 468 },
    selected: false,
    dragging: false,
  },
  {
    width: 288,
    height: 156,
    id: '2',
    data: { content: '運動', name: '主題' },
    position: { x: 13, y: 48 },
    type: 'variableNode',
    selected: false,
    positionAbsolute: { x: 13, y: 48 },
    dragging: false,
  },
  {
    width: 217,
    height: 149,
    id: '6',
    data: { content: '如何保持{主題}的習慣', label: 'Node 3' },
    position: { x: -121, y: 377 },
    type: 'promptNode',
    selected: false,
    dragging: false,
    positionAbsolute: { x: -121, y: 377 },
  },
];

const initialEdges = [
  { source: '4', target: '1', id: '1' },
  { source: '0', target: '2', id: '2' },
  { source: '2', target: '3', id: '3' },
  { source: '3', target: '4', id: '4' },
  { source: '2', target: '6', id: '6' },
  { source: '6', target: '1', id: '7' },
];

const initialViewPort = { x: 746, y: 94, zoom: 1 };

const additionalItems = [{ title: <span className="cursor-pointer">system</span> }];

const System = () => {
  const flowContext = React.useContext(FlowContext);
  const { updateProject, project, makeSystemByTemplate } = useProject();

  const [system, setSystem] = React.useState<string>('');

  const onSave = async () => {
    const flow = flowContext.rfInstance?.toObject();
    await updateProject.mutateAsync({
      system,
      systemFlow: flow,
    });
  };

  const makeSystem = useCallback(async () => {
    const flow = flowContext.rfInstance?.toObject();
    if (flow) {
      // TODO: remove
      console.log({
        nodes: JSON.stringify(flow.nodes),
        edges: JSON.stringify(flow.edges),
        viewport: JSON.stringify(flow.viewport),
      });
      const paths = findNodePath(flow);
      const tempPromise = paths.map(async (path) => {
        const [prompt, variable] = path.reduce(
          ([contents, v], node) => {
            if (node.type === 'promptNode') {
              return [contents + (node.data.content || ''), v];
            } else if (node.type === 'variableNode') {
              v[node.data.name] = node.data.content;
              return [contents, v];
            } else {
              return [contents, v];
            }
          },
          ['', {} as Record<string, unknown>],
        );

        return makeSystemByTemplate({ prompt, variable });
      });
      const temp = await Promise.all(tempPromise);
      setSystem(temp.join('\n'));
    }
  }, [flowContext.rfInstance]);

  React.useEffect(() => {
    if (flowContext.rfInstance) {
      makeSystem();
    }
  }, [flowContext.rfInstance, makeSystem]);

  const tools: Tool[] = [
    { title: 'Prompt Node', type: 'promptNode' },
    { title: 'Detail', type: 'promptNode', content: '回答時盡量詳細' },
    { title: 'Code Only', type: 'promptNode', content: '只回應我程式碼的部分' },
    { title: 'Traditional Chinese', type: 'promptNode', content: '只使用繁體中文回應' },
    { title: 'Example', type: 'promptNode', content: '請舉例說明' },
    { title: 'Table', type: 'promptNode', content: '請用表格呈現' },
    { title: 'Variable', type: 'variableNode' },
  ];

  return (
    <>
      <div className="fixed left-0 z-20 flex justify-between p-2 bg-white">
        <BreadCrumb additionalItems={additionalItems} />
      </div>
      <div className="fixed right-0 z-20 p-3 -translate-y-1/2 bg-white rounded-md top-1/2">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between mb-2 ">
            <div className="flex items-center font-bold">系統</div>
            <Button type="primary" onClick={onSave} className="float-right">
              保存
            </Button>
          </div>
          <Input.TextArea rows={6} value={system} className="w-full mb-2" />
          <div className="flex justify-between">
            <Button type="primary" onClick={makeSystem}>
              生成
            </Button>
            <TestChat system={system ? system : project?.system || ''} />
          </div>
        </div>
      </div>
      <FlowToolBox tools={tools} />
      <Flow
        initialNodes={project?.systemFlow?.nodes || initialNodes}
        initialEdges={project?.systemFlow?.edges || initialEdges}
        initialViewport={project?.systemFlow?.viewport || initialViewPort}
      />
    </>
  );
};

export const SystemPage = () => {
  return (
    <ReactFlowProvider>
      <FlowProvider>
        <System />
      </FlowProvider>
    </ReactFlowProvider>
  );
};
