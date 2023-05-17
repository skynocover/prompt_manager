import React from 'react';
import { AppContext } from './AppContext';
import { useNavigate } from 'react-router-dom';

function App() {
  const { user } = React.useContext(AppContext);

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
