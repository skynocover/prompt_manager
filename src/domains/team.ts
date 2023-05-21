import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppContext } from '../AppContext';

import { doc, setDoc, getDoc, getDocs, collection, query, deleteDoc } from 'firebase/firestore';
import { createId } from '@paralleldrive/cuid2';

import { firestore } from '../utils/firebase';

export interface IProjectInfo {
  id: string;
  projectName: string;
  projectDescription: string;
}

export interface ProjectFormData {
  projectName: string;
  projectDescription?: string;
  openAIKey?: string;
  model?: string;
  system?: string;
}

export const getAllProjects = async (teamId: string): Promise<IProjectInfo[]> => {
  const querySnapshot = await getDocs(query(collection(firestore, 'teams', teamId, 'projects')));
  return querySnapshot.docs.map((doc) => {
    const { projectName, projectDescription } = doc.data();
    return { id: doc.id, projectName, projectDescription };
  });
};

export const useTeam = () => {
  const appCtx = React.useContext(AppContext);
  const queryClient = useQueryClient();

  const {
    isLoading,
    error,
    data: team,
  } = useQuery({
    queryKey: ['Team', appCtx.teamId],
    queryFn: async () => {
      if (!appCtx.teamId) return {};
      const docRef = doc(firestore, 'teams', appCtx.teamId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { teamName, admins, members } = docSnap.data();

        const querySnapshot = await getDocs(
          query(collection(firestore, 'teams', appCtx.teamId, 'projects')),
        );
        const projects = querySnapshot.docs.map((doc) => {
          const { projectName, projectDescription } = doc.data();
          return { id: doc.id, projectName, projectDescription };
        });

        return { id: appCtx.teamId, teamName, admins, members, projects };
      }

      return {};
    },
    staleTime: 60000,
  });

  const createProject = useMutation(
    async ({ teamId, projectFormData }: { teamId: string; projectFormData: ProjectFormData }) => {
      const projectId = createId();

      await setDoc(doc(firestore, 'teams', teamId, 'projects', projectId), projectFormData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['Team', appCtx.teamId] });
      },
    },
  );

  const delProject = useMutation(
    async ({ teamId, projectId }: { teamId: string; projectId: string }) => {
      await deleteDoc(doc(firestore, 'teams', teamId, 'projects', projectId));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['Team', appCtx.teamId] });
      },
    },
  );

  return { isLoading, error, createProject, delProject, team };
};
