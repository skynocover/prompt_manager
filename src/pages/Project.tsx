import BreadCrumb from '../components/BreadCrumb';
import Flow from '../components/Flow';
import ProjectSetting, { ProjectData } from '../components/ProjectSetting';
import { useProject } from '../domains/project';
import { TestChat } from '../modals/TestChat';

const ProjectPage = () => {
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
          <TestChat />
        </div>
      </>
      <Flow />
    </>
  );
};

export default ProjectPage;
