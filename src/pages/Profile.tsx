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

const Profile = () => {
  const user = useContext(AuthContext);
  const userData = useContext(UserDataContext);
  const [changedImage, setChangedImage] = useState<File>();
  const [changedImageURL, setChangedImageURL] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const storageRef = ref(storage, "imagee");

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
        updateImageFirebase(downloadedURL).then(() => getUserData());
      });
    });
  };

  //SET user's photoURL in Firebase database

  const updateImageFirebase = async (image: string) => {
    if (user?.curUser?.uid) {
      const userRef = doc(db, "users", user?.curUser?.uid); // Kullanıcı referansı oluşturma
      await updateDoc(userRef, { photoURL: image }); //
    }
  };

  useEffect(() => {
    getUserData();
  }, [user]);

  useEffect(() => {
    console.log(changedImage?.name);
  }, [changedImage]);

  const getUserData = async () => {
    const q = query(
      collection(db, "users"),
      where("uid", "==", user?.curUser?.uid)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      console.log("Bos");
    } else {
      snapshot.forEach((item) => {
        console.log(item.data());
        const data = item.data() as UserProps;
        userData?.setUserData(data);
      });
    }
  };

  if (userData == null) {
    return <>Loading....</>;
  }

  return (
    <>
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
      <div>
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
    </>
  );
};

export default Profile;
