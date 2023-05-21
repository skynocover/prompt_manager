import { NodeProps, Handle, Position } from 'reactflow';

const DiamondNode = ({ id, data }: NodeProps) => {
  return (
    <div id={id} className="relative w-[160px] h-[60px]">
      <svg viewBox="0 0 160 60" preserveAspectRatio="xMidYMid meet" width="100%">
        <polygon points="80,0 160,30 80,60 0,30" fill="white" stroke="black" stroke-width="1" />
      </svg>

      <div className="w-[160px] h-[60px] absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center">
        <span className="p-3 text-xs text-center">{data.label}</span>
      </div>

      <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
      <Handle type="source" position={Position.Right} id="a" style={{ background: '#555' }} />
      <Handle type="source" position={Position.Left} id="b" style={{ background: '#555' }} />
    </div>
  );
};

export default DiamondNode;
