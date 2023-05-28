import React, { useState } from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { Input } from 'antd';

import { FlowContext } from '../FlowContext';

export const SystemNode = ({ id, data }: NodeProps) => {
  const { nodes, setNodes } = React.useContext(FlowContext);
  const [inputText, setInputText] = useState('你是一個好的系統');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);

    setNodes(
      nodes.map((node) => {
        if (node.id === id) {
          node.data.content = e.target.value;
        }
        return node;
      }),
    );
  };

  React.useEffect(() => {
    if (data && data.content) {
      setInputText(data.content);
    }
  }, [data]);

  return (
    <div id={id} className="bg-white h-500 w-300">
      <div className="flex items-center justify-center p-2 bg-gray-200 h-100">
        <label>System</label>
      </div>
      <div className="p-4">
        <Input.TextArea value={inputText} onChange={handleInputChange} />
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
    </div>
  );
};
