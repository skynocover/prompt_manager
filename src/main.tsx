import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import './index.css';
import 'antd/dist/reset.css';
import 'tailwindcss/tailwind.css';
import 'reactflow/dist/style.css';

import { AppProvider } from './AppContext';
import App from './App.tsx';
import Teams from './pages/Teams.tsx';
import Login from './pages/Login.tsx';
import Team from './pages/Team.tsx';
import Project from './pages/Project.tsx';
import { SystemPage } from './pages/System.tsx';
import { FlowProvider } from './components/FlowContext.tsx';

// Create a client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <AppProvider>
    <QueryClientProvider client={queryClient}>
      <ReactFlowProvider>
        <FlowProvider>
          <Router>
            <Routes>
              <Route path="/teams" Component={Teams} />
              <Route path="/team/:teamId" Component={Team} />
              <Route path="/team/:teamId/chat" Component={Project} />
              <Route path="/team/:teamId/system" Component={SystemPage} />
              <Route path="/login" Component={Login} />
              <Route path="/" Component={App} />
            </Routes>
          </Router>
        </FlowProvider>
      </ReactFlowProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </AppProvider>,
);
