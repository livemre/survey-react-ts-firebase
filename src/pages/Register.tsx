import React, {
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { AuthContext } from "../Context";
import checklist from "../assets/checklist.png";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [isApply, setIsApply] = useState<boolean>(false);

  const navigate = useNavigate();

  const register = async () => {
    setButtonDisabled(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((credential) => {
        console.log("register success");
        registerDB(credential.user.uid, credential.user.email);
      })
      .then(() => navigate("/dashboard"))
      .catch((error) => {
        setError(error.message);
        setButtonDisabled(false);
      });
  };

  useEffect(() => {
    if (email === "" || password === "" || passwordRepeat === "") {
      setButtonDisabled(true);
    } else if (password !== passwordRepeat) {
      setButtonDisabled(true);
    } else if (isApply !== true) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [email, password, passwordRepeat, isApply]);

  const registerDB = async (uid: string, user_email: string | null) => {
    // Add a new document in collection "cities"
    await setDoc(doc(db, "users", uid), {
      email: user_email,
      uid: uid,
      username: await makeAvailableUsername(),
      photoURL:
        "https://images.unsplash.com/photo-1711950903476-cc92274c0f12?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    });
  };

  useEffect(() => {
    makeAvailableUsername();
  }, []);

  const randomNumber = (max: number) => {
    return Math.floor(Math.random() * max) + 1;
  };

  const generateUsername = () => {
    let username;
    let status = false;
    const num = randomNumber(1000000);
    username = "user" + num;
    return username;
  };

  const isUsernameAvailable = async (username: string) => {
    const q = query(collection(db, "users"), where("username", "==", username));
    const snapshot = await getDocs(q);
    return snapshot.empty;
  };

  // Username olustur. Uygun mu diye sorgula eger uygunsa username dondur uygun degilse tekrar olusturup sorgula. uygun olana kadar dene.

  const makeAvailableUsername = async () => {
    let username;
    let result;
    let isAvailable;

    do {
      username = generateUsername();
      isAvailable = await isUsernameAvailable(username);
      console.log("User Var" + username);
    } while (!isAvailable);

    result = username;
    console.log(result);

    return result;
  };

  return (
    <div className="bg-amber-500">
      <div className="flex flex-col justify-center items-center mx-auto max-w-md p-3 h-lvh ">
        <p className="kaushan-script-regular text-5xl text-center text-white mb-5">
          Register for Surveyify
        </p>
        <div className="flex flex-col w-full p-3 gap-3 justify-center">
          <input
            className="bg-grey-200 shadow-lg p-3 rounded"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
            }}
          />
          <input
            className="bg-grey-200 shadow-lg p-3 rounded"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
            }}
          />
          <input
            className="bg-grey-200 shadow-lg p-3 rounded"
            placeholder="Repeat Password"
            type="password"
            value={passwordRepeat}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setPasswordRepeat(e.target.value);
            }}
          />
          <div className="flex gap-2">
            <input
              type="checkbox"
              checked={isApply}
              onChange={() => setIsApply((prev) => !prev)}
            />
            <p>I have read and accepted terms & conditions</p>
          </div>

          <p>{error && error}</p>
          <button
            className={`text-white bg-indigo-500 ${
              !buttonDisabled ? "hover:bg-violet-600" : "cursor-disabled"
            } shadow-lg px-6 py-3 rounded disabled:opacity-75`}
            onClick={register}
            disabled={buttonDisabled}
          >
            Register
          </button>
          <p className="text-amber-100">
            Already have an account?{" "}
            <Link className="text-white underline" to={"/login"}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
