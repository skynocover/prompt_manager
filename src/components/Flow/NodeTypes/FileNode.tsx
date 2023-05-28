import React, { useRef } from 'react';
import { Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { NodeProps, Handle, Position } from 'reactflow';

import { FlowContext } from '../FlowContext';

export const FileNode = ({ id, data }: NodeProps) => {
  const { nodes, setNodes } = React.useContext(FlowContext);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNodes(
          nodes.map((node) => {
            if (node.id === id) node.data.content = reader.result as string;
            return node;
          }),
        );
      };
      reader.readAsText(file);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePrefix = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodes(
      nodes.map((node) => {
        if (node.id === id) node.data.prefix = e.target.value;
        return node;
      }),
    );
  };

  const handleSuffix = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodes(
      nodes.map((node) => {
        if (node.id === id) node.data.suffix = e.target.value;
        return node;
      }),
    );
  };

  return (
    <div id={id} className="bg-white h-500 w-300">
      <div className="flex items-center justify-center p-2 bg-gray-200 h-100">
        <label>File</label>
      </div>
      <div className="flex flex-col p-4 space-y-2">
        <Input placeholder="根據以下文件回答問題" value={data.prefix} onChange={handlePrefix} />
        <div className="flex flex-row items-center space-x-2">
          <input ref={fileInputRef} type="file" onChange={handleFileChange} />
          <UploadOutlined onClick={handleUploadClick} />
        </div>
        <Input placeholder="請使用上述文件回答問題" value={data.suffix} onChange={handleSuffix} />
      </div>
      <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
    </div>
  );
};
