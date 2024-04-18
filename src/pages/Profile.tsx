import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { AuthContext, UserDataContext } from "../Context";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, storage } from "../services/firebase";
import { UserProps } from "../Context";
import { IoClose } from "react-icons/io5";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FaRegCheckCircle } from "react-icons/fa";
import { GrUpdate } from "react-icons/gr";

const Profile = () => {
  const user = useContext(AuthContext);
  const userData = useContext(UserDataContext);
  const [changedImage, setChangedImage] = useState<File>();
  const [changedImageURL, setChangedImageURL] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const [username, setUsername] = useState<string | undefined>("");
  const [name, setName] = useState<string | undefined>("");
  const [lastName, setLastName] = useState<string | undefined>("");
  const [desc, setDesc] = useState<string | undefined>("");
  const [_isUsernameAvailable, _setIsUsernameAvailable] =
    useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);

  const isUsernameAvailable = async (username: string) => {
    const q = query(collection(db, "users"), where("username", "==", username));
    const snapshot = await getDocs(q);
    return snapshot.empty;
  };

  useEffect(() => {
    if (username) {
      isUsernameAvailable(username).then((data) =>
        _setIsUsernameAvailable(data)
      );
    }
  }, [username]);

  useEffect(() => {
    setName(userData?.userData?.firstName);
    setLastName(userData?.userData?.lastName);
    setDesc(userData?.userData?.desc);
    setUsername(userData?.userData?.username);
  }, [userData]);

  const uploadImage = async () => {
    if (!changedImage) {
      console.error("No image selected to upload!");
      return;
    }

    const imageRef = ref(
      storage,
      `images/${user?.curUser?.uid}/${changedImage.name}`
    ); // Yüklenen dosya için yol oluşturma
    await uploadBytes(imageRef, changedImage).then(function (snapshot) {
      console.log("Uploaded an image!");
      console.log(snapshot);

      getDownloadURL(snapshot.ref).then((downloadedURL) => {
        setChangedImageURL(downloadedURL);
        updateImageFirebase(downloadedURL);
      });
    });
  };

  //SET user's photoURL in Firebase database

  const updateImageFirebase = async (image: string) => {
    if (user?.curUser?.uid) {
      const userRef = doc(db, "users", user?.curUser?.uid); // Kullanıcı referansı oluşturma
      await updateDoc(userRef, { photoURL: image }).then(() =>
        userData?.getUserData()
      ); //
    }
  };

  useEffect(() => {
    userData?.getUserData();
  }, [user]);

  useEffect(() => {
    console.log(changedImage?.name);
  }, [changedImage]);

  if (userData == null) {
    return <>Loading....</>;
  }

  const updateProfile = () => {
    console.log("UPDATE PROFILE");
    setUpdating(true);
    if (user?.curUser?.uid) {
      const userRef = doc(db, "users", user?.curUser?.uid);
      updateDoc(userRef, {
        firstName: name,
        lastName: lastName,
        desc: desc,
        username: username,
      }).then(() => setUpdating(false));
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        id="modal"
        className={`fixed flex-col justify-between p-8 top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-1/2 h-1/2 flex justify-center items-center bg-black bg-white border shadow-lg z-50 ${
          showModal ? "" : "hidden"
        }`}
      >
        {changedImageURL !== null ? (
          <div
            className="changed-avatar"
            style={{ backgroundImage: `url(${changedImageURL})` }}
          ></div>
        ) : (
          <img
            src={userData.userData?.photoURL}
            className="w-32 h-32 rounded-full"
          />
        )}
        <input
          type="file"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
              setChangedImage(file);
              const reader = new FileReader();
              reader.onload = (e) =>
                setChangedImageURL(e.target?.result as string);
              reader.readAsDataURL(file);
            }
          }}
        />
        <button
          onClick={uploadImage}
          className="border py-2 px-8 hover:bg-teal-500 rounded"
        >
          Upload
        </button>
        <IoClose
          color="black"
          size={32}
          className="absolute top-0 right-0 m-2 cursor-pointer"
          onClick={() => setShowModal(false)}
        />
      </div>

      <div className="w-1/3 flex flex-col gap-3 m-12 p-3">
        <h3 className="text-2xl">Edit Profile</h3>
        <div className="flex flex-row items-center gap-3 mb-12">
          <img
            src={userData?.userData?.photoURL}
            className="w-32 h-32 rounded-full"
          />

          <button
            onClick={() => setShowModal((prev) => !prev)}
            className="border p-2 m-2"
          >
            Change Avatar
          </button>
        </div>
        <div className="flex flex-row gap-3">
          <div className="flex flex-col flex-1">
            <label>First Name</label>
            <input
              value={name}
              placeholder={"First Name"}
              className=" border rounded p-3"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
            />
          </div>
          <div className="flex flex-col flex-1">
            <label>Last Name</label>
            <input
              value={lastName}
              placeholder="Last Name"
              className=" border rounded p-3"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setLastName(e.target.value)
              }
            />
          </div>
        </div>
        <div>
          <div className="flex flex-col flex-2">
            <label>Username</label>
            <div className="flex flex-row gap-3 items-center">
              <input
                value={username}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setUsername(e.target.value)
                }
                placeholder={userData.userData?.username}
                className=" border rounded p-3"
              />
              {_isUsernameAvailable ? (
                <FaRegCheckCircle size={32} color="green" />
              ) : (
                <FaRegCheckCircle size={32} color="red" />
              )}
            </div>
          </div>
        </div>
        <div className="">
          <div className="flex flex-col">
            <label>Description</label>
            <textarea
              value={desc}
              placeholder={"Description"}
              className=" border rounded p-3"
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                setDesc(e.target.value);
              }}
            />
          </div>
        </div>
        <button
          disabled={!_isUsernameAvailable || updating}
          onClick={updateProfile}
          className={`
          ${updating ? "cursor-disabled" : ""}
          ${
            _isUsernameAvailable
              ? "p-3 border hover:bg-teal-500"
              : "p-3 border hover:bg-teal-200 cursor-disabled"
          }`}
        >
          <div className="flex flex-row items-center justify-center gap-3">
            {updating ? <GrUpdate size={28} color="grey" /> : ""}
            <p>Update</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Profile;
