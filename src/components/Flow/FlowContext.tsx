import React from 'react';
import {
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  ReactFlowInstance,
  Node,
  Edge,
  GetViewport,
  SetViewport,
  Project,
  NodeChange,
  EdgeChange,
  Viewport,
  useViewport,
} from 'reactflow';

interface FlowContextProps {
  nodes: Node<any, string | undefined>[];
  setNodes: React.Dispatch<React.SetStateAction<Node<any, string | undefined>[]>>;
  onNodesChange: any;

  edges: Edge<any>[];
  setEdges: React.Dispatch<React.SetStateAction<Edge<any>[]>>;
  onEdgesChange: any;

  getViewport: GetViewport;
  setViewport: SetViewport;

  rfInstance: ReactFlowInstance | undefined;
  setRfInstance: React.Dispatch<React.SetStateAction<ReactFlowInstance | undefined>>;
  rfProject: Project;

  initNodes: () => void;
}

const FlowContext = React.createContext<FlowContextProps>(undefined!);

interface AppProviderProps {
  children: React.ReactNode;
}

const initialNodes: Node[] = [
  {
    id: '0',
    type: 'input',
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
];

const FlowProvider = ({ children }: AppProviderProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { getViewport, setViewport, project: rfProject } = useReactFlow();
  const [rfInstance, setRfInstance] = React.useState<ReactFlowInstance>();

  const initNodes = () => {
    setNodes(initialNodes);
    setEdges([]);
    setViewport({ x: 0, y: 0, zoom: 1 });
  };

  /////////////////////////////////////////////////////

  return (
    <FlowContext.Provider
      value={{
        nodes,
        setNodes,
        edges,
        setEdges,
        getViewport,
        setViewport,
        rfInstance,
        setRfInstance,
        rfProject,
        onNodesChange,
        onEdgesChange,
        initNodes,
      }}
    >
      {children}
    </FlowContext.Provider>
  );
};

export { FlowContext, FlowProvider };
