import React from 'react';
import {
  getAuth,
  onAuthStateChanged,
  User,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import * as antd from 'antd';

import { TeamService } from './utils/team';
import { Project } from './utils/project';

const provider = new GoogleAuthProvider();
interface AppContextProps {
  setModal: React.Dispatch<any>;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  demoSignIn: () => Promise<void>;

  teamService: TeamService | undefined;
  setTeamService: React.Dispatch<React.SetStateAction<TeamService | undefined>>;

  Project: Project | undefined;
  setProject: React.Dispatch<React.SetStateAction<Project | undefined>>;
}

const AppContext = React.createContext<AppContextProps>(undefined!);

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
  const [modal, setModal] = React.useState<any>(null);
  const auth = getAuth();

  const [teamService, setTeamService] = React.useState<TeamService>();
  const [Project, setProject] = React.useState<Project>();

  React.useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          console.log({ uid: user.uid, token: await user.getIdToken() });

          // TODO: 刪除
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          // window.signOut = auth.signOut();
        } else {
          // User is signed out
          // ...
        }
      });
      ///
    } catch (error) {
      ///
    }
  };

  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential) {
        const token = credential.accessToken;
        const user = result.user;
        console.log({ user, token });
      }
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log({ errorCode, errorMessage, credential, email });
    }
  };

  const signOut = async () => {
    await auth.signOut();
  };

  const demoSignIn = async () => {
    await signInWithEmailAndPassword(auth, 'user@gmail.com', '123456');
  };

  /////////////////////////////////////////////////////

  return (
    <AppContext.Provider
      value={{
        setModal,
        signIn,
        signOut,
        demoSignIn,
        teamService,
        setTeamService,
        Project,
        setProject,
      }}
    >
      {children}

      {modal && (
        <antd.Modal onOk={() => setModal(null)} onCancel={() => setModal(null)}>
          {modal}
        </antd.Modal>
      )}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
