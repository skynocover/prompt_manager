import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppContext } from '../AppContext';

import {
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  or,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { createId } from '@paralleldrive/cuid2';

import { firestore } from '../utils/firebase';
import { auth } from '../utils/firebase';

export interface Team {
  id: string;
  teamName: string;
  admins: string[];
  members: string[];
  openAiKey?: string;
  firebaseConfig?: any;
}

const getAllTeams = async (userEmail: string): Promise<Team[]> => {
  const teams: Team[] = [];

  const query2 = query(
    collection(firestore, 'teams'),
    or(where('admins', 'array-contains', userEmail), where('members', 'array-contains', userEmail)),
  );

  const querySnapshot = await getDocs(query2);
  querySnapshot.forEach((doc) => {
    const { teamName, admins, members } = doc.data();
    teams.push({ id: doc.id, teamName, admins, members });
  });

  return teams;
};

export const useTeams = () => {
  const appCtx = React.useContext(AppContext);
  const queryClient = useQueryClient();

  const [user] = useAuthState(auth);

  const {
    isLoading,
    error,
    data: teams,
  } = useQuery({
    queryKey: ['Teams', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return await getAllTeams(user?.email || '');
    },
    staleTime: 60000,
  });

  const createTeam = useMutation(
    async ({ teamName }: { teamName: string }) => {
      await setDoc(doc(firestore, 'teams', createId()), {
        teamName,
        admins: [user?.email],
        members: [],
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['Teams', user?.email] });
      },
    },
  );

  const updateTeam = useMutation(
    async ({ teamId, teamName }: { teamId: string; teamName: string }) => {
      if (!appCtx.teamId) return;

      await updateDoc(doc(firestore, 'teams', teamId), { teamName });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['Teams', user?.email] });
      },
    },
  );

  const delTeam = useMutation(
    async (teamId: string) => {
      await deleteDoc(doc(firestore, 'teams', teamId));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['Teams', user?.email] });
      },
    },
  );

  return { isLoading, error, teams, createTeam, updateTeam, delTeam };
};
