import React, { useCallback } from 'react';
import { Input, Button } from 'antd';
import { ReactFlowProvider } from 'reactflow';

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
    position: { x: 36, y: 134 },
    positionAbsolute: { x: 36, y: 134 },
    selected: true,
    dragging: false,
  },
  {
    width: 150,
    height: 36,
    id: '1',
    type: 'output',
    data: { label: '輸出' },
    position: { x: 36, y: 434 },
    selected: false,
    dragging: false,
    positionAbsolute: { x: 36, y: 434 },
  },
  {
    width: 222,
    height: 120,
    id: '3',
    type: 'promptNode',
    data: { label: 'Prompt', content: '回答時盡量詳細' },
    position: { x: 0, y: 245 },
    selected: false,
    dragging: false,
    positionAbsolute: { x: 0, y: 245 },
  },
];

const initialEdges = [
  { source: '0', sourceHandle: null, target: '3', targetHandle: null, id: 'reactflow__edge-0-3' },
  { source: '3', sourceHandle: null, target: '1', targetHandle: null, id: 'reactflow__edge-3-1' },
];

const initialViewPort = { x: 679.2157908041769, y: 101.42390172467725, zoom: 1.5535229620677677 };

const additionalItems = [{ title: <span className="cursor-pointer">system</span> }];

const System = () => {
  const flowContext = React.useContext(FlowContext);
  const { updateProject, project } = useProject();

  const [system, setSystem] = React.useState<string>('');

  const onSave = async () => {
    const flow = flowContext.rfInstance?.toObject();
    await updateProject.mutateAsync({
      system,
      systemFlow: flow,
    });
  };

  const makeSystem = useCallback(() => {
    const flow = flowContext.rfInstance?.toObject();
    if (flow) {
      const paths = findNodePath(flow);
      const temp = paths.reduce((result, path) => {
        const contents = path.map((node) => (node.data.content ? node.data.content + '\n' : ''));
        return result + contents.join('') + '\n';
      }, '');
      setSystem(temp);
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
