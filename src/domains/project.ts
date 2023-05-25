import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ReactFlowJsonObject } from 'reactflow';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { SystemChatMessage, BaseChatMessage } from 'langchain/schema';

import { SystemMessagePromptTemplate, ChatPromptTemplate } from 'langchain/prompts';

import { AppContext } from '../AppContext';
import { firestore } from '../utils/firebase';

export interface Project {
  id?: string;
  projectName?: string;
  projectDescription?: string;
  openai?: ChatOpenAI;
  apiKey?: string;
  model?: string;
  preSystem?: string;
  messages?: BaseChatMessage[];
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
          preSystem,
          messages,
          systemFlow,
          chatFlow,
        } = docSnap.data();

        const openai = apiKey
          ? new ChatOpenAI({
              temperature: 0,
              openAIApiKey: apiKey,
              modelName: model || 'gpt-3.5-turbo',
              streaming: true,
            })
          : undefined;

        return {
          id: appCtx.projectId,
          projectName,
          projectDescription,
          openai,
          apiKey,
          model,
          preSystem,
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
      preSystem,
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
        preSystem,
        messages,
        systemFlow,
        chatFlow,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['Project', appCtx.projectId] });
        queryClient.invalidateQueries({ queryKey: ['TeamProjects', appCtx.teamId] });
      },
    },
  );

  const sendMessages = useMutation(
    async ({
      messages,
      system,
      cb,
    }: {
      messages: BaseChatMessage[];
      system?: string;
      cb?: (token: string) => void;
    }) => {
      if (!project?.openai) return;

      if (system) {
        messages.unshift(new SystemChatMessage(system));
      }
      return await project.openai.call(messages, undefined, [
        {
          handleLLMNewToken(token: string) {
            cb && cb(token);
          },
        },
      ]);
    },
  );

  const makeSystemByTemplate = async ({
    prompt,
    variable,
  }: {
    prompt: string;
    variable: Record<string, unknown>;
  }): Promise<string> => {
    const translationPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(prompt),
    ]);

    return (await translationPrompt.formatPromptValue(variable)).toChatMessages()[0].text;
  };

  return { isLoading, error, updateProject, sendMessages, project, makeSystemByTemplate };
};
