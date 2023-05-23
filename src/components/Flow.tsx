import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  addEdge,
  Controls,
  Node,
  Edge,
  Viewport,
  XYPosition,
  Connection,
  Background,
  OnConnectStartParams,
} from 'reactflow';

import { FlowContext } from '../components/FlowContext';
import { nodeTypes } from './NodeTypes';

const getNewNode = (position: XYPosition, type = 'default', content?: string): Node => {
  const id = `${+new Date()}`;
  return { id, data: { content, label: `Node ${id}` }, position, type };
};

const fitViewOptions = { padding: 3 };

let connecting = false;

const Flow = ({
  initialNodes,
  initialEdges,
  initialViewport,
}: {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  initialViewport?: Viewport;
}) => {
  ////////////////////////////////////     功能     ////////////////////////////////////

  //////////////////////////////////     Setting     //////////////////////////////////
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const connectingNodeId = useRef<string | null>('');
  const connectingHandleId = useRef<string | null>('');

  const {
    nodes,
    setNodes,
    edges,
    setEdges,
    rfInstance,
    setRfInstance,
    rfProject,
    onNodesChange,
    onEdgesChange,
    setViewport,
  } = React.useContext(FlowContext);

  React.useEffect(() => {
    initialNodes && setNodes(initialNodes);
    initialEdges && setEdges(initialEdges);
    initialViewport && setViewport(initialViewport);
  }, [initialNodes, initialEdges, initialViewport, setNodes, setEdges, setViewport]);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      connecting = true;
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges],
  );

  const onConnectStart = useCallback(
    (_: React.MouseEvent | React.TouchEvent, { nodeId, handleId }: OnConnectStartParams) => {
      connectingNodeId.current = nodeId;
      connectingHandleId.current = handleId;
    },
    [],
  );

  const onConnectEnd = useCallback(
    (event: any) => {
      // 如果拖曳到的是面板上就新增
      const targetIsPane = event.target.classList.contains('react-flow__pane');

      if (targetIsPane && reactFlowWrapper?.current && !connecting) {
        const { top, left } = reactFlowWrapper.current.getBoundingClientRect() || {
          top: 0,
          left: 0,
        };

        const newNode = getNewNode(
          rfProject({ x: event.clientX - left - 75, y: event.clientY - top }),
          'promptNode',
        );
        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) =>
          eds.concat({
            id: newNode.id,
            source: connectingNodeId.current || '',
            target: newNode.id,
            sourceHandle: connectingHandleId.current || undefined,
          }),
        );
      }
      connecting = false;
    },
    [rfProject, setEdges, setNodes],
  );

  const onEdgeDoubleClick = (_: React.MouseEvent, edge: any) => {
    const newLabel = prompt('Enter new label for edge:', edge.label);
    if (newLabel !== null) {
      const newEdges = edges.map((el) => {
        if (el.id === edge.id) {
          el.label = newLabel;
        }
        return el;
      });
      setEdges(newEdges);
    }
  };

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();

      // eslint-disable-next-line no-unsafe-optional-chaining
      const reactFlowBounds = reactFlowWrapper?.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      const content = event.dataTransfer.getData('application/reactflow_content');

      if (typeof type === 'undefined' || !type || !reactFlowBounds || !rfInstance) return;

      const position = rfInstance.project({
        x: event.clientX - reactFlowBounds.left - 75,
        y: event.clientY - reactFlowBounds.top - 20,
      });

      setNodes((nds) => nds.concat(getNewNode(position, type, content)));
    },
    [rfInstance, setNodes],
  );

  return (
    <div className="flex h-screen bg-slate-800" ref={reactFlowWrapper}>
      <ReactFlow
        onEdgeDoubleClick={onEdgeDoubleClick}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        fitView
        fitViewOptions={fitViewOptions}
        onInit={setRfInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
      >
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default Flow;
