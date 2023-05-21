import React from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import * as antd from 'antd';

const provider = new GoogleAuthProvider();
interface AppContextProps {
  setModal: React.Dispatch<any>;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  demoSignIn: () => Promise<void>;

  teamId: string | undefined;
  setTeamId: React.Dispatch<React.SetStateAction<string | undefined>>;

  projectId: string | undefined;
  setProjectId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const AppContext = React.createContext<AppContextProps>(undefined!);

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
  const [modal, setModal] = React.useState<any>(null);
  const auth = getAuth();

  const [teamId, setTeamId] = React.useState<string>();
  const [projectId, setProjectId] = React.useState<string>();

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

        teamId,
        setTeamId,

        projectId,
        setProjectId,
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
