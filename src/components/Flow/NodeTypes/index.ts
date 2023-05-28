import { DiamondNode } from './DiamondNode';
import { StepNode } from './StepNode';
import { PromptNode } from './PromptNode';
import { SystemNode } from './SystemNode';
import { VariableNode } from './VariableNode';
import { FileNode } from './FileNode';
import { CodeNode } from './CodeNode';
import { OutputNode } from './OutputNode';

export const nodeTypes = {
  systemNode: SystemNode,
  diamondNode: DiamondNode,
  stepNode: StepNode,
  promptNode: PromptNode,
  variableNode: VariableNode,
  fileNode: FileNode,
  codeNode: CodeNode,
  outputNode: OutputNode,
};

export const nodeStyle: Record<string, React.CSSProperties> = {
  systemNode: { width: 600 },
  diamondNode: { width: 600 },
  stepNode: { width: 600 },
  promptNode: { width: 270 },
  variableNode: { width: 270 },
  fileNode: { width: 350 },
  codeNode: { width: 550 },
  outputNode: { width: 550 },
};
