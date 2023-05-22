import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './utils/firebase';

function App() {
  const [user] = useAuthState(auth);

  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate('/teams');
    } else {
      navigate('/login');
    }
  }, [navigate, user]);

  return <></>;
}

export default App;
