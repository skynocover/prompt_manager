import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { ProjectFormData } from '../domains/team';

interface ProjectModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onOk: (values: ProjectFormData) => void;
  onCancel: () => void;
}

export const AddProject = ({ onOk }: { onOk: (values: ProjectFormData) => void }) => {
  const [openAddProject, setOpenAddProject] = React.useState(false);

  return (
    <>
      <Button type="primary" onClick={() => setOpenAddProject(true)}>
        Add
      </Button>
      <ProjectModal
        open={openAddProject}
        setOpen={setOpenAddProject}
        onOk={onOk}
        onCancel={() => setOpenAddProject(false)}
      />
    </>
  );
};

const ProjectModal: React.FC<ProjectModalProps> = ({ open, setOpen, onOk, onCancel }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values: ProjectFormData) => {
      onOk(values);
      form.resetFields();
      setOpen(false);
    });
  };

  return (
    <Modal open={open} title="新增專案" onOk={handleOk} onCancel={onCancel}>
      <Form form={form} layout="vertical">
        <Form.Item
          name="projectName"
          label="專案名稱"
          rules={[
            {
              required: true,
              message: '請輸入專案名稱',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="projectDescription" label="專案描述">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item name="openAIKey" label="OpenAI 金鑰">
          <Input />
        </Form.Item>
        <Form.Item name="model" label="模型">
          <Input />
        </Form.Item>
        <Form.Item name="system" label="系統">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
