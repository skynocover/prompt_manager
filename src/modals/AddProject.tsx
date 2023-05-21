import React from 'react';
import { Modal, Form, Input } from 'antd';

interface ProjectModalProps {
  open: boolean;
  onOk: (values: ProjectFormData) => void;
  onCancel: () => void;
}

export interface ProjectFormData {
  projectName: string;
  projectDescription?: string;
  openAIKey?: string;
  model?: string;
  system?: string;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ open, onOk, onCancel }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values: ProjectFormData) => {
      onOk(values);
      form.resetFields();
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

export default ProjectModal;
