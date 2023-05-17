import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  or,
  Firestore,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { createId } from '@paralleldrive/cuid2';

import { firestore } from './firebase';

//////////////////////////////  Teams  //////////////////////////////////

export interface Team {
  id: string;
  teamName: string;
  admins: string[];
  members: string[];
  openAiKey?: string;
  firebaseConfig?: any;
}

export const getAllTeams = async (userId: string): Promise<Team[]> => {
  const teams: Team[] = [];

  const query2 = query(
    collection(firestore, 'teams'),
    or(where('admins', 'array-contains', userId), where('members', 'array-contains', userId)),
  );

  const querySnapshot = await getDocs(query2);
  querySnapshot.forEach((doc) => {
    const { teamName, admins, members } = doc.data();
    teams.push({ id: doc.id, teamName, admins, members });
  });

  return teams;
};

export const createTeam = async (userId: string, teamName: string) => {
  console.log({ userId, teamName });
  await setDoc(doc(firestore, 'teams', createId()), {
    teamName,
    admins: [userId],
    members: [],
  });
};

export class TeamService {
  private readonly db: Firestore;
  private team: Team;

  constructor(teamId: string) {
    this.db = firestore;
    this.team = { id: teamId, teamName: '', admins: [], members: [] };
  }

  async init() {
    const docRef = doc(this.db, 'teams', this.team.id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { teamName, admins, members } = docSnap.data();

      this.team = { id: this.team.id, teamName, admins, members };
    }
    return this;
  }

  getTeam(): Team {
    return this.team;
  }

  async update(team: Team) {
    await updateDoc(doc(this.db, 'teams', this.team.id), {
      teamName: team.teamName,
    });
  }

  async delete() {
    await deleteDoc(doc(firestore, 'teams', this.team.id));
  }

  //////////////////////////  Member   //////////////////////////////////////

  async addMember(type: 'admins' | 'members', _email: string) {
    const email = _email.toLowerCase();
    if (!this.team[type]?.includes(email)) {
      this.team[type]?.push(email);
    }
    await updateDoc(doc(this.db, 'teams', this.team.id), { ...this.team });
  }

  async removeMember(_email: string) {
    const email = _email.toLowerCase();
    this.team.admins = this.team.admins?.filter((v) => v != email);
    this.team.members = this.team.members?.filter((v) => v != email);
    await updateDoc(doc(this.db, 'teams', this.team.id), { ...this.team });
  }
}
