import React from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { FlowContext } from '../FlowContext';

const chartTypes = ['general', 'barChart', 'pieChart'];

export const OutputNode = ({ id, data }: NodeProps) => {
  const { nodes, setNodes } = React.useContext(FlowContext);
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNodes(
      nodes.map((node) => {
        if (node.id === id) {
          node.data.chartType = event.target.value;
        }
        return node;
      }),
    );
  };

  return (
    <div id={id} className="w-full bg-white">
      <div className="flex items-center justify-center p-2 bg-gray-200 h-100">
        <label>OutputNode</label>
      </div>
      <div className="flex flex-col p-4">
        <select value={data.chartType} style={{ width: 200 }} onChange={handleSelectChange}>
          {chartTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
    </div>
  );
};
