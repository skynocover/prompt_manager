import React from 'react';
import {
  getAuth,
  onAuthStateChanged,
  User,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import * as antd from 'antd';

import { TeamService } from './utils/team';
import { ProjectService } from './utils/project';

const provider = new GoogleAuthProvider();
interface AppContextProps {
  user: User | undefined;
  setModal: React.Dispatch<any>;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;

  teamService: TeamService | undefined;
  setTeamService: React.Dispatch<React.SetStateAction<TeamService | undefined>>;

  projectService: ProjectService | undefined;
  setProjectService: React.Dispatch<React.SetStateAction<ProjectService | undefined>>;
}

const AppContext = React.createContext<AppContextProps>(undefined!);

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
  const [user, setUser] = React.useState<User | undefined>();
  const [modal, setModal] = React.useState<any>(null);
  const auth = getAuth();

  const [teamService, setTeamService] = React.useState<TeamService>();
  const [projectService, setProjectService] = React.useState<ProjectService>();

  React.useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setUser(user);
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
    setUser(undefined);
  };

  /////////////////////////////////////////////////////

  return (
    <AppContext.Provider
      value={{
        user,
        setModal,
        signIn,
        signOut,
        teamService,
        setTeamService,
        projectService,
        setProjectService,
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
