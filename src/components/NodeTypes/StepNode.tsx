import React, { useState } from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { Tabs, Input } from 'antd';
import type { TabsProps } from 'antd';

export const StepNode = ({ id, data }: NodeProps) => {
  const [inputText, setInputText] = useState('');

  React.useEffect(() => {
    setInputText(data.label);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `Input`,
      children: (
        <div className="p-4">
          <Input value={inputText} onChange={handleInputChange} />
        </div>
      ),
    },
    {
      key: '2',
      label: `Display`,
      children: (
        <div className="p-4">
          <p>{inputText}</p>
        </div>
      ),
    },
  ];

  return (
    <div id={id} className="bg-white h-500 w-300">
      <div className="flex items-center justify-center p-2 bg-gray-200 h-100">
        <label>Step</label>
      </div>
      <Tabs className="px-2" defaultActiveKey="1" items={items} />
      <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
    </div>
  );
};
