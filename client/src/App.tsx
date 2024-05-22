import React from "react";

import "./App.css";
import Home from "./Pages/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "Pages/Dashboard";
import { Toaster } from "components/ui/toaster";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home></Home>,
    },
    {
      path: "/dashboard/*",
      element: <Dashboard></Dashboard>,
    },
  ]);
  return (
    <main>
      <Toaster />
      <RouterProvider router={router}></RouterProvider>
    </main>
  );
}

export default App;
