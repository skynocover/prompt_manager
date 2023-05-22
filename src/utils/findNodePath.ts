/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Node, Edge, ReactFlowJsonObject } from 'reactflow';

export const findNodePath = (flow: ReactFlowJsonObject): Node[][] => {
  // 解析JSON數據
  const nodes: Node[] = flow?.nodes || [];
  const edges: Edge[] = flow?.edges || [];

  // 建立ID到Node對象的映射
  const nodeMap = new Map<string, Node>();
  for (const node of nodes) {
    nodeMap.set(node.id, node);
  }

  // 找出起始和終點節點
  let startNodeID: string | null = null;
  let endNodeID: string | null = null;
  for (const node of nodes) {
    if (node.type === 'input') startNodeID = node.id;
    if (node.type === 'output') endNodeID = node.id;
  }

  if (!startNodeID || !endNodeID) {
    throw new Error('Start or end node not found');
  }

  // 建立鄰接表
  const graph = new Map<string, string[]>();
  for (const edge of edges) {
    if (!graph.has(edge.source)) {
      graph.set(edge.source, []);
    }
    graph.get(edge.source)!.push(edge.target);
  }

  // DFS
  const res: Node[][] = [];
  const dfs = (node: string, path: Node[]) => {
    path.push(nodeMap.get(node)!);
    if (node === endNodeID) {
      res.push(path);
      return;
    }
    const neighbors = graph.get(node) || [];
    for (const neighbor of neighbors) {
      dfs(neighbor, [...path]);
    }
  };
  dfs(startNodeID, []);

  return res;
};
