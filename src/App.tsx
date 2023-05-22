import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';

const auth = getAuth();

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
