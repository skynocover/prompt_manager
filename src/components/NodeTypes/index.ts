import { DiamondNode } from './DiamondNode';
import { StepNode } from './StepNode';
import { PromptNode } from './PromptNode';
import { SystemNode } from './SystemNode';

export const nodeTypes = {
  systemNode: SystemNode,
  diamondNode: DiamondNode,
  stepNode: StepNode,
  promptNode: PromptNode,
};
