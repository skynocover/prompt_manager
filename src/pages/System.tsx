import React, { useCallback } from 'react';
import { Input, Button } from 'antd';
import { ReactFlowProvider } from 'reactflow';

import BreadCrumb from '../components/BreadCrumb';
import Flow from '../components/Flow';
import { useProject } from '../domains/project';
import { FlowProvider, FlowContext } from '../components/FlowContext';
import { findNodePath } from '../utils/findNodePath';
import { FlowToolBox, Tool } from '../components/FlowToolBox';
import { SystemParameters } from '../components/SystemParameters';

const initialNodes = [
  {
    width: 150,
    height: 36,
    id: '0',
    type: 'input',
    data: { label: '輸入' },
    position: { x: 342, y: -128 },
    positionAbsolute: { x: 342, y: -128 },
  },
  {
    width: 150,
    height: 36,
    id: '1',
    type: 'output',
    data: { label: '輸出' },
    position: { x: 406, y: 723 },
    positionAbsolute: { x: 406, y: 723 },
  },
  {
    width: 288,
    height: 156,
    id: '3',
    type: 'variableNode',
    data: { name: '等級', content: '初學者' },
    position: { x: 206, y: 262 },
    positionAbsolute: { x: 206, y: 262 },
  },
  {
    width: 217,
    height: 149,
    id: '4',
    type: 'promptNode',
    data: { content: '請給我推薦適合{等級}的{主題}' },
    position: { x: 240, y: 468 },
    positionAbsolute: { x: 240, y: 468 },
  },
  {
    width: 288,
    height: 156,
    id: '2',
    data: { content: '運動', name: '主題' },
    position: { x: 13, y: 48 },
    type: 'variableNode',
    positionAbsolute: { x: 13, y: 48 },
  },
  {
    width: 217,
    height: 149,
    id: '6',
    data: { content: '如何保持{主題}的習慣', label: 'Node 3' },
    position: { x: -121, y: 377 },
    type: 'promptNode',
    positionAbsolute: { x: -121, y: 377 },
  },
  {
    width: 217,
    height: 149,
    id: '7',
    data: { content: '只使用{{language}}回應' },
    position: { x: 536, y: 146 },
    type: 'promptNode',
    positionAbsolute: { x: 536, y: 146 },
  },
];

const initialEdges = [
  { source: '4', target: '1', id: '1' },
  { source: '0', target: '2', id: '2' },
  { source: '2', target: '3', id: '3' },
  { source: '3', target: '4', id: '4' },
  { source: '2', target: '6', id: '6' },
  { source: '6', target: '1', id: '7' },
  { source: '0', target: '7', id: '8' },
  { source: '7', target: '1', id: '9' },
];

const initialViewPort = { x: 352, y: 204, zoom: 0.92 };

const tools: Tool[] = [
  { title: 'Prompt Node', type: 'promptNode' },
  { title: 'Detail', type: 'promptNode', content: '回答時盡量詳細' },
  { title: 'Code Only', type: 'promptNode', content: '只回應我程式碼的部分' },
  { title: 'Traditional Chinese', type: 'promptNode', content: '只使用繁體中文回應' },
  { title: 'Example', type: 'promptNode', content: '請舉例說明' },
  { title: 'Table', type: 'promptNode', content: '請用表格呈現' },
  { title: 'Variable', type: 'variableNode' },
  { title: 'File', type: 'fileNode' },
  {
    title: 'OnlyCode',
    type: 'promptNode',
    content:
      '我想讓你充當算法輸出器。我將輸入算法描述，您將回复算法的Typescript實現。我希望您只在一個唯一的代碼塊內回复代碼，而不是其他任何內容。不要寫解釋。除非我指示您這樣做，否則不要鍵入命令。',
  },
];

const additionalItems = [{ title: <span className="cursor-pointer">system</span> }];

const System = () => {
  const flowContext = React.useContext(FlowContext);
  const { updateProject, project, makeSystemByTemplate } = useProject();

  const [preSystem, setPreSystem] = React.useState('');
  const [system, setSystem] = React.useState<string>('');

  const onSave = async () => {
    const flow = flowContext.rfInstance?.toObject();
    await updateProject.mutateAsync({
      preSystem: preSystem,
      systemFlow: flow,
    });
  };

  const makePreSystem = useCallback(async () => {
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
          // contents 內文, v 變數
          ([contents, v], node) => {
            if (node.type === 'promptNode') {
              return [contents + (node.data.content || ''), v];
            } else if (node.type === 'variableNode') {
              v[node.data.name] = node.data.content;
              return [contents, v];
            } else if (node.type === 'fileNode') {
              return [
                contents +
                  (node.data.prefix || '') +
                  (node.data.content || '') +
                  (node.data.suffix || ''),
                v,
              ];
            } else {
              return [contents, v];
            }
          },
          ['', {} as Record<string, unknown>],
        );

        return makeSystemByTemplate({ prompt, variable });
      });
      const temp = await Promise.all(tempPromise);
      setPreSystem(temp.join('\n'));
    }
  }, [flowContext.rfInstance, makeSystemByTemplate]);

  React.useEffect(() => {
    if (flowContext.rfInstance) {
      makePreSystem();
    }
  }, [flowContext.rfInstance, makePreSystem]);

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
          <div className="flex justify-end">
            <Button type="primary" onClick={makePreSystem}>
              生成
            </Button>
          </div>
          <Input.TextArea rows={6} value={preSystem} className="w-full mb-2" />

          <SystemParameters preSystem={preSystem} system={system} setSystem={setSystem} />
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
