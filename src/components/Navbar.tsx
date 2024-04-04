import React, {
  ChangeEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { AuthContext, UserDataContext, UserProps } from "../Context";
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
import { auth, db } from "../services/firebase";
import { signOut } from "firebase/auth";
import { IoIosNotifications } from "react-icons/io";

interface OptionMap {
  option: string | number;
  id: number;
}

const Navbar = () => {
  const user = useContext(AuthContext);
  const userData = useContext(UserDataContext);
  const [showModal, setShowModal] = useState(false);
  const [modalEvent, setModalEvent] = useState<boolean>(false);
  const [optionMap, setOptionMap] = useState<OptionMap[]>([]);
  const [options, setOptions] = useState<OptionMap[]>([]);
  const [question, setQuestion] = useState<string>("");
  const [menuVisible, setMenuVisible] = useState(true);

  const modalRef = useRef<HTMLDivElement>(null);
  const createButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    userData?.getUserData();
  }, [user]);

  useEffect(() => {
    if (showModal) {
      const handleOutsideClick = (event: MouseEvent) => {
        if (createButtonRef.current?.contains(event.target as HTMLElement)) {
          console.log("butona tiklandi");
        }
        if (
          !modalRef.current?.contains(event.target as HTMLElement) &&
          !createButtonRef.current?.contains(event.target as HTMLElement)
        ) {
          console.log("disari tiklandi");

          setShowModal(false);
        }
      };

      document.addEventListener("click", handleOutsideClick);

      return () => {
        document.removeEventListener("click", handleOutsideClick);
      };
    }
  }, [showModal]);

  const createSurvey = async () => {
    if (user?.curUser?.uid) {
      let uid: string | undefined = user.curUser.uid;
      const surveyData = {
        uid: uid,
        like: 0,
        comments: [],
        question: question,
        options: optionMap,
      };

      await addDoc(collection(db, "surveys"), surveyData);
    }

    console.log(question);
    console.log(optionMap);
  };

  const addOption = (newOption: OptionMap) => {
    setOptionMap([...optionMap, newOption]);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <>
      <div
        ref={modalRef}
        id="modal"
        className={`fixed top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-1/2 h-1/2 flex justify-center items-center bg-black bg-opacity-50 z-50 ${
          showModal ? "" : "hidden"
        }`}
      >
        <div>
          <textarea
            className="mb-2 w-64 p-2"
            placeholder="Question"
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              setQuestion(e.target.value);
            }}
          />
          <div className="flex flex-col gap-2">
            {optionMap.map((item) => {
              return (
                <input
                  placeholder={item.option.toString()}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const updatedOptionMap = [...optionMap];
                    updatedOptionMap[item.id - 1].option = e.target.value;
                    setOptionMap(updatedOptionMap);
                  }}
                />
              );
            })}
            <button
              className="rounded border text-white p-2 hover:bg-teal-400"
              onClick={() => {
                addOption({ option: "", id: optionMap.length + 1 });
              }}
            >
              + ADD OPTION
            </button>
            <button className="border p-2" onClick={createSurvey}>
              ADD SURVEY
            </button>
          </div>
        </div>
      </div>
      <div className="h-20 flex flex-row items-center bg-slate-800 justify-between px-3 px-32">
        <Link to={"/"}>
          <img src={Logo} width={100} height={50} />
        </Link>
        {!user?.curUser ? (
          <div className="flex flex-row gap-5 text-white items-center">
            <Link to={"/login"}>
              <p className="hover:underline">Log In</p>
            </Link>
            <Link to={"/register"}>
              <p className="border p-3 rounded hover:bg-teal-500">Register</p>
            </Link>
          </div>
        ) : (
          <div className="flex flex-row items-center gap-8">
            <div ref={createButtonRef}>
              <p
                className="border rounded p-3 text-white hover:bg-teal-500"
                onClick={() => setShowModal(true)}
              >
                + Create
              </p>
            </div>
            <div className="relative">
              <IoIosNotifications size={36} color="white" />
              <div className="text-white absolute bg-red-600 p-0 rounded-full w-6 h-6 flex items-center justify-center top-0 -right-1">
                3
              </div>
            </div>
            <div>
              <img
                src={userData?.userData?.photoURL}
                className="w-12 h-12 rounded-full"
                onClick={() => setMenuVisible((prev) => !prev)}
              />
              <div
                className={`${
                  menuVisible ? "visible" : "hidden"
                } absolute top-24 `}
              >
                <div className="flex flex-col">
                  <Link to={"/profile"}>
                    <p>Profile</p>
                  </Link>
                  <button onClick={logout}>Logout</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
