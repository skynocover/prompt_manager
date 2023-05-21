import React from 'react';
import { ChatCompletionRequestMessage } from 'openai';

import BreadCrumb from '../components/BreadCrumb';
import Flow from '../components/Flow';
import ProjectSetting, { ProjectData } from '../components/ProjectSetting';
import ChatsAndMessage from '../components/ChatsAndMessage';
import { sendMessage as simpleSendMessage } from '../utils/openai';
import { useProject } from '../domains/project';

const ProjectPage = () => {
  const [loading, setLoading] = React.useState(false);

  const { updateProject, project } = useProject();

  const onSave = async (projectData: ProjectData) => {
    if (project) {
      await updateProject.mutateAsync({
        projectName: projectData.projectName,
        projectDescription: projectData.projectDescription,
        apiKey: projectData.openAIKey,
        model: projectData.model,
        system: projectData.system,
      });
    }
  };

  const [messages, setMessages] = React.useState<ChatCompletionRequestMessage[]>([]);

  const onSendMessage = async (content: string) => {
    setLoading(true);
    try {
      const returnMessages = await simpleSendMessage(
        content,
        project?.apiKey || '',
        project?.system || '',
        messages,
      );
      setMessages(returnMessages);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="fixed left-0 z-20 flex justify-between p-2 bg-white">
        <BreadCrumb />
      </div>
      <>
        <div className="fixed right-0 z-20 p-3 -translate-y-1/2 bg-white rounded-md top-1/2">
          <ProjectSetting
            projectData={{
              projectName: project?.projectName || '',
              projectDescription: project?.projectDescription || '',
              openAIKey: project?.apiKey || '',
              model: project?.model || '',
              system: project?.system || '',
            }}
            onSave={onSave}
          />
          <ChatsAndMessage loading={loading} messages={messages} onSendMessage={onSendMessage} />
        </div>
      </>
      <Flow />
    </>
  );
};

export default ProjectPage;
