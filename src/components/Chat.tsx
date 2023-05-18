import React, { useState } from 'react';
import * as antd from 'antd';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { ChatCompletionRequestMessage } from 'openai';
import ReactMarkdown from 'react-markdown';
import {
  Project,
  getAllProjects,
  createProject,
  deleteProject,
  IProjectInfo,
} from '../utils/project';

const Chat = ({ projects, refresh }: { projects: IProjectInfo[]; refresh: any }) => {
  const [loading, setLoading] = React.useState(false);

  const [chosenProject, setChosenProject] = React.useState<Project>();

  // 聊天畫面
  const [searchText, setSearchText] = React.useState('');
  const [message, setMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  const { teamId = '' } = useParams();

  const deletePj = async (project: Project) => {
    const { isDenied } = await Swal.fire({
      title: `Delete Project ${project.getProject().projectName}?`,
      showConfirmButton: false,
      showDenyButton: true,
      showCancelButton: true,
      denyButtonText: 'Delete Project',
    });

    if (isDenied) {
      await deleteProject(teamId, project.Id);
      refresh();
    }
  };

  const onSendMessage = async (message: string) => {
    setLoading(true);
    try {
      await chosenProject?.getOpenAIChat()?.SendMessage(message);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter' && !isComposing) {
      if (!event.shiftKey) {
        event.preventDefault();
        if (message.trim() !== '') {
          onSendMessage(message);
          setMessage('');
        }
      }
    }
  };

  const chooseProject = async (p: IProjectInfo) => {
    const project = new Project(teamId, p.id);
    await project.init();

    setChosenProject(project);
  };

  const saveChat = async () => {
    await chosenProject?.updateProject();
  };

  return (
    <>
      <div>
        <div className="container mx-auto rounded-lg shadow-lg">
          <div className="flex items-center justify-between px-5 py-5 bg-white border-b-2">
            <div className="text-2xl font-semibold">GoingChat</div>
            <div className="w-1/2">
              <input
                type="text"
                name=""
                id=""
                placeholder="search IRL"
                className="w-full px-5 py-3 bg-gray-100 rounded-2xl"
              />
            </div>
          </div>
          <div className="flex flex-row justify-between bg-white">
            <div className="flex flex-col w-2/5 overflow-y-auto border-r-2">
              <div className="px-2 py-4 border-b-2">
                <input
                  type="text"
                  placeholder="search chatting"
                  className="w-full px-2 py-2 border-2 border-gray-200 rounded-2xl"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
              {projects
                .filter((p) => p.projectName.includes(searchText))
                .map((p) => (
                  <div
                    onClick={() => chooseProject(p)}
                    className={`flex flex-row items-center rounded-md my-1 justify-center px-2 py-4 ${
                      chosenProject && chosenProject.Id == p.id
                        ? 'bg-slate-400'
                        : 'hover:bg-slate-200  transition-all duration-200 '
                    } `}
                  >
                    <div className="w-full">
                      <div className="text-lg font-semibold">{p.projectName}</div>
                      {/* <span className="text-gray-500">Pick me at 9:00 Am</span> */}
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex flex-col justify-between w-full px-5">
              {chosenProject && (
                <>
                  <div className="flex flex-col mt-5">
                    {chosenProject
                      .getOpenAIChat()
                      ?.getMessages()
                      .map((m) => {
                        if (m.role === 'assistant') {
                          return (
                            <div className="flex justify-start mb-4">
                              <div className="px-4 py-3 ml-2 text-white bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl">
                                <ReactMarkdown>{m.content}</ReactMarkdown>
                              </div>
                            </div>
                          );
                        } else if (m.role === 'user') {
                          return (
                            <div className="flex justify-end mb-4">
                              <div className="px-4 py-3 mr-2 text-white bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl">
                                {m.content}
                              </div>
                            </div>
                          );
                        }
                      })}
                  </div>
                  <div className="py-3">
                    <antd.Spin spinning={loading}>
                      <textarea
                        className="w-full px-3 py-5 bg-gray-300 rounded-xl"
                        placeholder="type your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onCompositionStart={() => setIsComposing(true)}
                        onCompositionEnd={() => setIsComposing(false)}
                      />
                    </antd.Spin>
                  </div>
                </>
              )}
            </div>
            <div className="w-2/5 px-5 border-l-2">
              {chosenProject && (
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <div className="py-4 text-xl font-semibold">
                      {chosenProject.getProject().projectName}
                    </div>
                    <antd.Button type="primary">
                      <Link to={'/project/' + chosenProject.Id}>Edit</Link>
                    </antd.Button>
                    <antd.Button type="primary" onClick={saveChat}>
                      保存對話
                    </antd.Button>
                    <antd.Button type="ghost" onClick={() => deletePj(chosenProject)}>
                      Delete
                    </antd.Button>
                  </div>
                  <div className="my-2">{chosenProject.getProject().projectDescription}</div>
                  <div className="font-light">
                    system: {chosenProject.getOpenAIChat()?.getStorage().system}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
