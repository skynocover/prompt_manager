import React from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { Input } from 'antd';

import { FlowContext } from '../FlowContext';

export const VariableNode = ({ id, data }: NodeProps) => {
  const { nodes, setNodes } = React.useContext(FlowContext);

  const handleVariableNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNodes(
      nodes.map((node) => {
        if (node.id === id) {
          node.data.name = event.target.value;
        }
        return node;
      }),
    );
  };

  const handleVariableContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNodes(
      nodes.map((node) => {
        if (node.id === id) {
          node.data.content = event.target.value;
        }
        return node;
      }),
    );
  };

  return (
    <div id={id} className="bg-white h-500 w-300">
      <div className="flex items-center justify-center p-2 bg-gray-200 h-100">
        <label>Variable</label>
      </div>
      <div className="p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="variableName" className="text-gray-700">
              變數名稱:
            </label>
            <Input id="variableName" value={data.name} onChange={handleVariableNameChange} />
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="variableContent" className="text-gray-700">
              變數內容:
            </label>
            <Input
              id="variableContent"
              value={data.content}
              onChange={handleVariableContentChange}
            />
          </div>
        </div>
      </div>
      <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
    </div>
  );
};
