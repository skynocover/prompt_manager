import React, { useState, useEffect } from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { Select } from 'antd';
import Editor from '@monaco-editor/react';
import { FlowContext } from '../../components/FlowContext';

const { Option } = Select;

const languages = [
  'javascript',
  'python',
  'java',
  'cpp',
  'csharp',
  'typescript',
  'ruby',
  'go',
  'php',
  // add or remove as needed
];

export const CodeNode = ({ id, data }: NodeProps) => {
  const { nodes, setNodes } = React.useContext(FlowContext);
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState('javascript');

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setInputText(value);

      setNodes(
        nodes.map((node) => {
          if (node.id === id) {
            node.data.content = value;
          }
          return node;
        }),
      );
    }
  };

  useEffect(() => {
    if (data && data.content) {
      setInputText(data.content);
    }
  }, [data]);

  // TODO: 讓Select能用
  return (
    <div id={id} className="w-full bg-white">
      <div className="flex items-center justify-center p-2 bg-gray-200 h-100">
        <label>Code</label>
      </div>
      <div className="flex flex-col p-4">
        <Select defaultValue={language} style={{ width: 200 }} onChange={setLanguage}>
          {languages.map((lang) => (
            <Option key={lang} value={lang}>
              {lang}
            </Option>
          ))}
        </Select>
        <Editor
          height="300px"
          defaultLanguage={language}
          value={inputText}
          onChange={handleEditorChange}
        />
      </div>
      <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
    </div>
  );
};
