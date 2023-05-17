import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./index.css";
import "antd/dist/reset.css";
import "tailwindcss/tailwind.css";

import { AppProvider } from "./AppContext";
import App from "./App.tsx";
import Teams from "./pages/Teams.tsx";
import Login from "./pages/Login.tsx";
import Team from "./pages/Team.tsx";
import Project from "./pages/Project.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <AppProvider>
    <Router>
      <Routes>
        <Route path="/teams" Component={Teams} />
        <Route path="/team/:teamId" Component={Team} />
        <Route path="/project/:projectId" Component={Project} />
        <Route path="/login" Component={Login} />
        <Route path="/" Component={App} />
      </Routes>
    </Router>
  </AppProvider>
);
