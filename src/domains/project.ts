import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppContext } from '../AppContext';

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from 'openai';

import { firestore } from '../utils/firebase';

export interface Project {
  id?: string;
  projectName?: string;
  projectDescription?: string;
  openai?: OpenAIApi;
  apiKey?: string;
  model?: string;
  system?: string;
  messages?: ChatCompletionRequestMessage[];
}

export const useProject = () => {
  const appCtx = React.useContext(AppContext);
  const queryClient = useQueryClient();

  const {
    isLoading,
    error,
    data: project,
  } = useQuery({
    queryKey: ['Project', appCtx.projectId],
    queryFn: async () => {
      if (!appCtx.teamId || !appCtx.projectId) return {};
      const docRef = doc(firestore, 'teams', appCtx.teamId, 'projects', appCtx.projectId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { projectName, projectDescription, openAIChat } = docSnap.data();

        const configuration = new Configuration({ apiKey: openAIChat?.apiKey || '' });
        const openai = new OpenAIApi(configuration);

        return {
          id: appCtx.projectId,
          projectName,
          projectDescription,
          openai,
          apiKey: openAIChat.apiKey,
          model: openAIChat.model,
          system: openAIChat.system,
          messages: openAIChat.messages,
        };
      }
      return {};
    },
    staleTime: 60000,
  });

  const updateProject = useMutation(
    async ({
      projectName,
      projectDescription,
      apiKey,
      model,
      system,
      messages,
    }: {
      projectName?: string;
      projectDescription?: string;
      apiKey?: string;
      model?: string;
      system?: string;
      messages?: ChatCompletionRequestMessage[];
    }) => {
      if (!appCtx.teamId || !appCtx.projectId) return;
      await updateDoc(doc(firestore, 'teams', appCtx.teamId, 'projects', appCtx.projectId), {
        ...project,
        openai: undefined,
        projectName: projectName,
        projectDescription: projectDescription,
        apiKey,
        model,
        system,
        messages,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['Project', appCtx.projectId] });
      },
    },
  );

  const sendMessage = useMutation(
    async (content: string) => {
      if (!project?.openai) return;

      project.messages.push({ role: 'user', content });

      const messages = project.system
        ? [
            {
              role: 'system',
              content: project.system,
            } as ChatCompletionRequestMessage,
            ...project.messages,
          ]
        : project.messages;

      const { data } = await project.openai.createChatCompletion({
        model: project.model || 'gpt-3.5-turbo',
        messages,
      });
      if (data.choices[0].message) {
        project.messages.push(data.choices[0].message);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['Project', appCtx.projectId] });
      },
    },
  );

  return { isLoading, error, updateProject, sendMessage, project };
};
