import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { AuthContext } from "../Context";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../services/firebase";
import { IoIosRemoveCircle } from "react-icons/io";
import { CiImageOn } from "react-icons/ci";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoTrashBin } from "react-icons/io5";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

interface OptionMap {
  option: string | number;
  id: number;
}

export const Submit2 = () => {
  const [changedImage, setChangedImage] = useState<File>();
  const [changedImageURL, setChangedImageURL] = useState<string | null>(null);
  const maxNumber = 69;
  const [question, setQuestion] = useState<string>("");
  const [optionMap, setOptionMap] = useState<OptionMap[]>([]);
  const user = useContext(AuthContext);

  // Yeni option eklendiginde listeyi ekrana basiyor.
  useEffect(() => {
    console.log(optionMap);
  }, [optionMap]);

  // Option butonuna basildiginda yeni bir eleman ekle ve bos baslik olsun.
  // Eleman eklemeden once listeyi idlerine gore yeniden diz.
  const addOption = (newOption: OptionMap) => {
    const modifitedMap = [...optionMap, newOption];
    setOptionMap(modifitedMap);
  };

  // Delete butonuna basildiginda elemani sil. listeyi idlerini tekrardan duzenle.
  // Eleman silindiginde listenin idlerini tekrardan duzenle
  const deleteOption = (id: number) => {
    console.log("Delete option works");
    console.log("ID" + id);
    const newMap = optionMap.filter((item) => {
      return item.id != id;
    });
    reOrderOptionsMap(newMap);
  };

  const reOrderOptionsMap = (optionList: OptionMap[]) => {
    const orderedMap = optionList.map((item, index) => ({
      ...item,
      id: index + 1,
    }));

    setOptionMap(orderedMap);
  };

  // Add survey butonuna basildiginda fonksiyondan burasi cagriliyor ve fotolar firebase storage a kaydedilecek.

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
      });
    });
  };

  const createSurvey = async () => {
    console.log(optionMap);
    await uploadImage().then(() => {
      if (user?.curUser?.uid) {
        let uid: string | undefined = user.curUser.uid;
        const surveyData = {
          uid: uid,
          question: question,
          options: optionMap,
          image: changedImageURL,
        };

        addDoc(collection(db, "surveys"), surveyData);
      }
    });
  };

  return (
    <div className="flex flex-col  border  shadow-lg bg-slate-200 p-20 ">
      <div className="rounded bg-white p-3 w-1/2">
        <h1 className="text-xl	">Create a survey 2</h1>
        <div>
          <div
            className="changed-avatar"
            style={{ backgroundImage: `url(${changedImageURL})` }}
          ></div>
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

          <p className="text-xl">Question</p>
          <input
            className="mb-2 w-full p-2 border"
            placeholder="Question"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setQuestion(e.target.value);
            }}
          />
          <div className="flex flex-col gap-2 bg-slate-200 p-6">
            <div>
              <div className="flex flex-row gap-3 my-3">
                <p className=" text-xl my-3">Options</p>
                <div className="flex flex-row items-center rounded border border-white  hover:bg-gray-100 px-3">
                  <IoMdAddCircleOutline size={32} color="green" />

                  <button
                    className=" text-black  p-2"
                    onClick={() => {
                      addOption({ option: "", id: optionMap.length + 1 });
                    }}
                  >
                    Add option
                  </button>
                </div>
              </div>
              <div className="flex flex-row gap-3 flex-wrap">
                {optionMap.map((item) => {
                  return (
                    <div
                      key={item.id}
                      className="flex flex-row items-center gap-3"
                    >
                      <input
                        value={item.option}
                        className="p-3 border rounded"
                        style={{ backgroundColor: "white" }}
                        placeholder={item.option.toString()}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const updatedOptionMap = [...optionMap];
                          updatedOptionMap[item.id - 1].option = e.target.value;
                          setOptionMap(updatedOptionMap);
                        }}
                      />
                      <IoTrashBin
                        color="red"
                        size={18}
                        onClick={() => {
                          deleteOption(item.id);
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col my-3">
          <button
            className="border p-2 bg-blue-500 w-48 self-end hover:bg-blue-600 text-white"
            onClick={createSurvey}
          >
            ADD SURVEY
          </button>
        </div>
      </div>
    </div>
  );
};
