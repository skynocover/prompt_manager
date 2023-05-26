import React, { useState, useEffect } from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import Editor from '@monaco-editor/react';
import { FlowContext } from '../../components/FlowContext';

const languages: string[] = [
  'abap',
  'apex',
  'azcli',
  'bat',
  'c',
  'cameligo',
  'clojure',
  'coffee',
  'cpp',
  'csharp',
  'csp',
  'css',
  'dockerfile',
  'fsharp',
  'go',
  'graphql',
  'handlebars',
  'html',
  'ini',
  'java',
  'javascript',
  'json',
  'kotlin',
  'less',
  'lexon',
  'lua',
  'markdown',
  'mips',
  'msdax',
  'mysql',
  'objective-c',
  'pascal',
  'perl',
  'pgsql',
  'php',
  'postiats',
  'powerquery',
  'powershell',
  'pug',
  'python',
  'r',
  'razor',
  'redis',
  'redshift',
  'restructuredtext',
  'ruby',
  'rust',
  'sb',
  'scheme',
  'scss',
  'shell',
  'sol',
  'sql',
  'st',
  'swift',
  'systemverilog',
  'tcl',
  'twig',
  'typescript',
  'vb',
  'xml',
  'yaml',
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

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
  };

  return (
    <div id={id} className="w-full bg-white">
      <div className="flex items-center justify-center p-2 bg-gray-200 h-100">
        <label>Code</label>
      </div>
      <div className="flex flex-col p-4">
        <select defaultValue={language} style={{ width: 200 }} onChange={handleSelectChange}>
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
        <Editor
          height="300px"
          defaultLanguage={language}
          language={language}
          value={inputText}
          onChange={handleEditorChange}
        />
      </div>
      <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
    </div>
  );
};
