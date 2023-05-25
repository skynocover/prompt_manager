import React, { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { ProjectFormData } from '../domains/team';
import { useProject, Project } from '../domains/project';

interface ProjectModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onCancel: () => void;
}

export const EditProject = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Edit
      </Button>
      <ProjectModal open={open} setOpen={setOpen} onCancel={() => setOpen(false)} />
    </>
  );
};

const ProjectModal: React.FC<ProjectModalProps> = ({ open, setOpen, onCancel }) => {
  const { project, updateProject } = useProject();
  const [editedProjectData, setEditedProjectData] = useState<ProjectFormData>({
    projectName: project?.projectName || '',
    projectDescription: project?.projectDescription || '',
    openAIKey: project?.apiKey || '',
    model: project?.model || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const renderEditableInput = (name: keyof ProjectFormData, type = 'text') => {
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

  const handleOk = async () => {
    updateProject
      .mutateAsync({
        projectName: editedProjectData.projectName,
        projectDescription: editedProjectData.projectDescription,
        apiKey: editedProjectData.openAIKey,
        model: editedProjectData.model,
      })
      .then(() => {
        setOpen(false);
      });
  };

  return (
    <Modal open={open} title="新增專案" onOk={handleOk} onCancel={onCancel}>
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
      </div>
    </Modal>
  );
};
