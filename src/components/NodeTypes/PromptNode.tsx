import React, { useState } from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { Input } from 'antd';

import { FlowContext } from '../../components/FlowContext';

export const PromptNode = ({ id, data }: NodeProps) => {
  const { nodes, setNodes } = React.useContext(FlowContext);
  const [inputText, setInputText] = useState('');

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
        <label>Prompt</label>
      </div>
      <div className="p-4">
        <Input.TextArea value={inputText} onChange={handleInputChange} />
      </div>
      <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
    </div>
  );
};
