import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ReactFlowJsonObject } from 'reactflow';
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from 'openai';

import { AppContext } from '../AppContext';
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
  systemFlow?: ReactFlowJsonObject;
  chatFlow?: ReactFlowJsonObject;
}

export const useProject = () => {
  const appCtx = React.useContext(AppContext);
  const queryClient = useQueryClient();

  const {
    isLoading,
    error,
    data: project,
  } = useQuery<Project>({
    queryKey: ['Project', appCtx.projectId],
    queryFn: async () => {
      if (!appCtx.teamId || !appCtx.projectId) return {};
      const docRef = doc(firestore, 'teams', appCtx.teamId, 'projects', appCtx.projectId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const {
          projectName,
          projectDescription,
          apiKey,
          model,
          system,
          messages,
          systemFlow,
          chatFlow,
        } = docSnap.data();

        const configuration = new Configuration({ apiKey: apiKey || '' });
        const openai = new OpenAIApi(configuration);

        return {
          id: appCtx.projectId,
          projectName,
          projectDescription,
          openai,
          apiKey,
          model,
          system,
          messages,
          systemFlow,
          chatFlow,
        };
      }
      return {};
    },
    staleTime: 60000,
    enabled: !!appCtx.projectId,
  });

  const updateProject = useMutation(
    async ({
      projectName,
      projectDescription,
      apiKey,
      model,
      system,
      messages,
      systemFlow,
      chatFlow,
    }: Project) => {
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
        systemFlow,
        chatFlow,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['Project', appCtx.projectId] });
      },
    },
  );

  const sendMessages = useMutation(
    async ({ messages, system }: { messages: ChatCompletionRequestMessage[]; system?: string }) => {
      if (!project?.openai) return;

      if (system) {
        messages.unshift({ role: 'system', content: system });
      } else if (project.system) {
        messages.unshift({ role: 'system', content: project.system });
      }

      const { data } = await project.openai.createChatCompletion({
        model: project.model || 'gpt-3.5-turbo',
        messages,
      });
      if (data.choices[0].message) {
        return data.choices[0].message;
      }
    },
  );

  return { isLoading, error, updateProject, sendMessages, project };
};
