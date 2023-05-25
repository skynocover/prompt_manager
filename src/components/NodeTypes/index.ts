import { DiamondNode } from './DiamondNode';
import { StepNode } from './StepNode';
import { PromptNode } from './PromptNode';
import { SystemNode } from './SystemNode';
import { VariableNode } from './VariableNode';
import { FileNode } from './FileNode';

export const nodeTypes = {
  systemNode: SystemNode,
  diamondNode: DiamondNode,
  stepNode: StepNode,
  promptNode: PromptNode,
  variableNode: VariableNode,
  fileNode: FileNode,
};
