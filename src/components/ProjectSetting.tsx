import React, { useState } from 'react';
import { Input, Button } from 'antd';

export interface ProjectData {
  projectName: string;
  projectDescription: string;
  openAIKey: string;
  model: string;
  system: string;
}

interface ProjectEditorProps {
  projectData: ProjectData;
  onSave: (updatedProjectData: ProjectData) => void;
}

const ProjectEditor: React.FC<ProjectEditorProps> = ({ projectData, onSave }) => {
  const [editedProjectData, setEditedProjectData] = useState(projectData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(editedProjectData);
  };

  const renderEditableInput = (name: keyof ProjectData, type = 'text') => {
    if (type === 'key') {
      return (
        <Input.Password
          name={name}
          value={editedProjectData[name]}
          onChange={handleChange}
          className="w-full"
        />
      );
    }
    if (type === 'textArea') {
      return (
        <Input.TextArea rows={6} name={name} value={editedProjectData[name]} className="w-full" />
      );
    }
    return (
      <Input
        name={name}
        value={editedProjectData[name]}
        onChange={handleChange}
        className="w-full"
      />
    );
  };

  return (
    <div className="max-w-md mx-auto mt-4">
      <div className="mb-4">
        <div className="mb-2 font-bold">專案名稱</div>
        {renderEditableInput('projectName')}
      </div>
      <div className="mb-4">
        <div className="mb-2 font-bold">專案描述</div>
        {renderEditableInput('projectDescription')}
      </div>
      <div className="mb-4">
        <div className="mb-2 font-bold">OpenAI金鑰</div>
        {renderEditableInput('openAIKey', 'key')}
      </div>
      <div className="mb-4">
        <div className="mb-2 font-bold">模型</div>
        {renderEditableInput('model')}
      </div>
      <div className="mb-4">
        <div className="mb-2 font-bold">系統</div>
        {renderEditableInput('system', 'textArea')}
      </div>
      <Button type="primary" onClick={handleSave} className="float-right">
        保存
      </Button>
    </div>
  );
};

export default ProjectEditor;
