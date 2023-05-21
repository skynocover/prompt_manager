import React, { useState } from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { Tabs, Input } from 'antd';

const { TabPane } = Tabs;

const MyComponent = ({ id, data }: NodeProps) => {
  const [inputText, setInputText] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  return (
    <div className="bg-white h-500 w-300">
      <div className="flex items-center justify-center bg-gray-200 h-100">
        <label>Step</label>
      </div>
      <Tabs>
        <TabPane tab="Input" key="input">
          <div className="p-4">
            <Input value={inputText} onChange={handleInputChange} />
          </div>
        </TabPane>
        <TabPane tab="Display" key="display">
          <div className="p-4">
            <p>{inputText}</p>
          </div>
        </TabPane>
      </Tabs>
      <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
    </div>
  );
};

export default MyComponent;
