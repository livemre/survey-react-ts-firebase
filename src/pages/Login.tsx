import React, { ChangeEvent, useContext, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { AuthContext } from "../Context";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((credential) => {
        console.log(credential.user);
        navigate("/dashboard");
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <div className="bg-teal-500">
      <div className="flex flex-col justify-center items-center mx-auto max-w-md p-3 h-lvh ">
        <p className="kaushan-script-regular text-5xl text-center text-white mb-5">
          Login
        </p>
        <div className="flex flex-col w-full p-3 gap-3 justify-center">
          <input
            className="bg-grey-200 shadow-lg p-3 rounded"
            placeholder="mail address"
            type="email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
          <input
            className="bg-grey-200 shadow-lg p-3 rounded"
            placeholder="password"
            type="password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
          <p>{error && error}</p>
          <button
            className={`text-white bg-amber-500 ${
              !buttonDisabled ? "hover:bg-amber-400" : "cursor-disabled"
            } shadow-lg px-6 py-3 rounded disabled:opacity-75`}
            onClick={signIn}
          >
            Sign In
          </button>
          <p className="text-teal-100">
            Do not have an account?{" "}
            <Link className="text-white underline" to={"/register"}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
