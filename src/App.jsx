import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import DashboardPrinc from "./pages/DashboardPrinc";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/DashboardPrinc" element={<DashboardPrinc />} />
    </Routes>
  );
}

export default App;
