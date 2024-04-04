import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";

const Dashboard = () => {
  const [email, setEmail] = useState<string | null | undefined>("");
  const user = useContext(AuthContext);

  const navigate = useNavigate();

  const logout = () => {
    signOut(auth).then(() => navigate("/login"));
  };

  return (
    <div>
      Dashboard
      <p>{user?.curUser?.email}</p>
      <button onClick={logout}>Logout</button>
      {user?.curUser?.photoURL ? (
        <img src={user?.curUser?.photoURL} width={150} height={150} />
      ) : (
        ""
      )}
    </div>
  );
};

export default Dashboard;
