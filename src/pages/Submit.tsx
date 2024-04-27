import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { AuthContext } from "../Context";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../services/firebase";
import { IoIosRemoveCircle } from "react-icons/io";
import { CiImageOn } from "react-icons/ci";
import { IoMdAddCircleOutline } from "react-icons/io";

interface OptionMap {
  option: string | number;
  id: number;
}

export const Submit = () => {
  const [images, setImages] = React.useState([]);
  const maxNumber = 69;
  const [question, setQuestion] = useState<string>("");
  const [optionMap, setOptionMap] = useState<OptionMap[]>([]);
  const user = useContext(AuthContext);
  const [changedMap, setChangedMap] = useState(false);

  useEffect(() => {
    reOrderOptionsMap(optionMap);
  }, [changedMap]);

  const onImageUpdateChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList as never[]);
  };

  const addOption = (newOption: OptionMap) => {
    setOptionMap([...optionMap, newOption]);
    setChangedMap((prev) => !prev);
  };

  const deleteOption = (id: number) => {
    console.log("Delete option works");

    console.log("ID" + id);

    const newMap = optionMap.filter((item) => {
      return item.id != id;
    });

    setOptionMap(newMap);
    setChangedMap((prev) => !prev);
    console.log(optionMap);
  };

  const reOrderOptionsMap = (optionList: OptionMap[]) => {
    const orderedMap = optionList.map((item, index) => ({
      ...item,
      id: index + 1,
    }));
    setOptionMap([]);
    setOptionMap(orderedMap);
    console.log("----");

    console.log(orderedMap);
    console.log(optionMap);
  };

  const createSurvey = async () => {
    console.log(optionMap);

    // if (user?.curUser?.uid) {
    //   let uid: string | undefined = user.curUser.uid;
    //   const surveyData = {
    //     uid: uid,
    //     question: question,
    //     options: optionMap,
    //   };

    //   await addDoc(collection(db, "surveys"), surveyData);
    // }
  };

  return (
    <div className="flex flex-col  border  shadow-lg bg-slate-200 p-20 ">
      <div className="rounded bg-white p-3 w-1/2">
        <h1 className="text-xl	">Create a survey</h1>
        <div>
          <ImageUploading
            multiple
            value={images}
            onChange={onImageUpdateChange}
            maxNumber={maxNumber}
          >
            {({
              imageList,
              onImageUpload,
              onImageRemoveAll,
              onImageUpdate,
              onImageRemove,
              isDragging,
              dragProps,
            }) => (
              // write your building UI
              <div className="upload__image-wrapper">
                <div
                  className="border p-3 flex flex-row items-center justify-center"
                  onClick={onImageUpload}
                  {...dragProps}
                >
                  <div className="flex flex-col items-center justify-center">
                    <CiImageOn size={64} color="grey" />

                    <button style={isDragging ? { color: "red" } : undefined}>
                      Click or Drop here
                    </button>
                  </div>
                </div>
                <div className="flex flex-row p-3 gap-3">
                  {imageList.map((image, index) => (
                    <div
                      key={index}
                      className="border rounded"
                      style={{
                        position: "relative",
                        paddingRight: "32px",
                        paddingTop: "32px",
                        paddingBottom: "10px",
                        paddingLeft: "10px",
                      }}
                    >
                      <img src={image.dataURL} alt="" width="100" />
                      <IoIosRemoveCircle
                        style={{
                          position: "absolute",
                          top: "3px",
                          right: "3px",
                        }}
                        color="grey"
                        size={32}
                        onClick={() => onImageRemove(index)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ImageUploading>
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
                    <div key={item.id}>
                      <input
                        className="p-3 border rounded"
                        style={{ backgroundColor: "white" }}
                        placeholder={item.option.toString()}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const updatedOptionMap = [...optionMap];
                          updatedOptionMap[item.id - 1].option = e.target.value;
                          setOptionMap(updatedOptionMap);
                        }}
                      />
                      <button
                        onClick={() => {
                          deleteOption(item.id);
                        }}
                      >
                        DELETE
                      </button>
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
