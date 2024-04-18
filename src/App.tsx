import { Children, useEffect, useState } from "react";
import "./App.css";
import { AuthContext, AuthProps, UserDataContext, UserProps } from "./Context";

import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./services/firebase";
import { User } from "firebase/auth";

import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Register from "./pages/Register.tsx";
import Login from "./pages/Login.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Home from "./pages/Home.tsx";
import Navbar from "./components/Navbar.tsx";
import Layout from "./components/Layout.tsx";
import Profile from "./pages/Profile.tsx";
import {
  addDoc,
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { get } from "firebase/database";
import { ApiGetUserData } from "./services/ApiCalls.ts";

function App() {
  const [currentUser, setCurrentUser] = useState<AuthProps>({ curUser: null });
  const [userData, setUserData] = useState<UserProps | null>(null);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />, // Layout componentini kullanın
      children: [
        { index: true, element: <Home /> }, // Ana sayfa için "index: true" kullanın
        { path: "register", element: <Register /> },
        { path: "login", element: <Login /> },
        { path: "dashboard", element: <Dashboard /> },
        { path: "profile", element: <Profile /> },
      ],
    },
  ]);

  const getUserData = async () => {
    const uid = currentUser.curUser?.uid;
    if (uid) {
      const data = await ApiGetUserData(uid);
      setUserData(data);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setCurrentUser({ curUser: user });
      } else {
        setCurrentUser({ curUser: null });
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={currentUser}>
      <UserDataContext.Provider value={{ userData, setUserData, getUserData }}>
        <RouterProvider router={router} />
      </UserDataContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
