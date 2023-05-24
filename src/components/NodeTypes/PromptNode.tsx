import React, { useState } from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { Button } from 'antd';

import { FlowContext } from '../../components/FlowContext';

export const PromptNode = ({ id, data }: NodeProps) => {
  const { nodes, setNodes } = React.useContext(FlowContext);
  const [inputText, setInputText] = useState('');
  const inputRef = React.useRef<HTMLTextAreaElement>(null); // create a ref

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

  const handleInsert = () => {
    const input = inputRef.current;
    if (input) {
      input.select;
      const start = input.selectionStart;
      const end = input.selectionEnd;
      setInputText(inputText.slice(0, start) + '{}' + inputText.slice(end));
      input.selectionStart = input.selectionEnd = start + 2;
      input.focus();
    }
  };

  return (
    <div id={id} className="bg-white h-500 w-300">
      <div className="flex items-center justify-center p-2 bg-gray-200 h-100">
        <label>Prompt</label>
      </div>
      <div className="flex flex-col p-4">
        <textarea
          ref={inputRef}
          className="rounded-md round"
          value={inputText}
          onChange={handleInputChange}
        />
        <Button className="mt-2" type="primary" onClick={handleInsert}>
          插入變數
        </Button>
      </div>
      <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
    </div>
  );
};
