import { db, storage, storageRef } from "./firebase-config";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadString,
  listAll,
  list,
  deleteObject,
} from "firebase/storage";

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode.react";
import SignUp from "./SignUp";
import AuthContext from "./contexts/AuthContext";

export default function App() {
  const fileTestCollectionRef = collection(db, "fileTest");
  //1
  const [fileTest, setFileTest] = useState([]);
  //2
  const [newTitle, setNewTitle] = useState("");
  //3
  const [newDocInfo, setNewDocInfo] = useState("");
  //4
  const [link, setLink] = useState(null);
  //5
  const [qrCode, setQrCode] = useState("");
  //6
  const [image, setImage] = useState(null);
  //7
  const [files, setFiles] = useState();
  //8
  const [cubeFace, setCubeFace] = useState({
    link: "",
  });
  //This uploads the image and then generates the url and sets it.

  //going to need to udpate filestruture.
  //ex. users/uuid/qrImage
  //ex. users/uuid/files

  //going to need to update rule
  //match {/users/{uid}/{image}}{
    //allow read, write: if request.auth.uid == uid
//}
//two options either pass the auth down each time, or create a context.
//will need more  work/study on context as it broke last time.
  const handleLinkUpload = () => {
    const qrStorageRef = ref(storage, "QrImage/" + newTitle);
    const uploadTask = uploadString(qrStorageRef, qrCode, "data_url");
    return getDownloadURL(qrStorageRef).then((url) => {
      setLink(url);
    });
  };
  //so what is happening. create image is the starting point, after it creates the image it then runs handleLinkUpload, it then runs createTest to add the linkt o the database.
  const createQrImage = () => {
    // try {
    let canvas = qrRef.current.querySelector("canvas");
    let qrFile = canvas.toDataURL("image/png");
    setQrCode(qrFile);
    // handleLinkUpload(qrFile)
    //clear states
    setCubeFace({
      link: "",
    });
    // } catch (err){
    //   alert(err + "We caught something")
    // }
    // setQrCode("");
  };

  const qrRef = useRef();
  //this basically creates the image and allows us to download the image.
  const downloadQRCode = (e, props) => {
    e.preventDefault();
    let canvas = qrRef.current.querySelector("canvas");
    console.log(canvas);

    let image = canvas.toDataURL("image/png");
    console.log(image);

    let anchor = document.createElement("a");
    anchor.href = image;
    anchor.download = newTitle;
    console.log(newTitle);

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    setCubeFace({
      link: "",
    });
    setNewTitle("");
  };

  const handleQRChange = (e) => {
    setCubeFace({ ...cubeFace, [e.target.name]: e.target.value });
  };

  const handleNameChange = (e) => {
    setNewTitle(e.target.value);
  };

  const handleTitleChange = (e) => {
    setNewTitle({ ...newTitle, [e.target.name]: e.target.value });
  };

  const handleDocInfoChange = (e) => {
    setNewDocInfo({ ...newDocInfo, [e.target.name]: e.target.value });
  };

  // creating the storage, .ref is the refernce creating a new folder id, ".put" uploading.
  // .on, snapshot = current progress, error checking,
  const handleUpload = async () => {
    const metadata = {
      contentType: "images/png",
    };
    const storageRef = ref(storage, "Images/" + image.name);
    const uploadTask = uploadBytesResumable(storageRef, image, metadata);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log("oops");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // setLink(downloadURL)
          setCubeFace({
            link: downloadURL,
          });
          setNewTitle(image.name);
          compactFile();
          // createQrImage();
          console.log("File available at", downloadURL);
        });
      }
    );
  };

  //can't update file name, just going to allow to update the doc info if anything. //Maybe it'd be best to have another field with the name of the file and qr image but not have it as the title.
  const updateTest = async (id, title) => {
    try {
      const testDoc = await doc(db, "fileTest", id);
      await updateDoc(testDoc, {
        DocInfo: newDocInfo,
      });
    } catch (err) {
      console.log(err);
    }
  };

  //The only way to delete the file is by using the title, but I can't update the title in the update function.
  const deleteTest = async (id, title) => {
    try {
      console.log(title);
      const testDoc = await doc(db, "fileTest", id);
      const deleteQrStorageRef = await ref(storage, "QrImage/" + title);
      deleteDoc(testDoc).then((title) => {
        deleteObject(deleteQrStorageRef);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getFileTest = async () => {
    const abc = onSnapshot(fileTestCollectionRef, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        // snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}))
        items.push({ id: doc.id, ...doc.data() });
      });
      setFileTest(items);
    });
  };

  useEffect(() => {
    getFileTest();
  }, []);

  const createTest = () => {
    addDoc(fileTestCollectionRef, {
      Title: newTitle,
      DocInfo: newDocInfo,
      Link: link,
    });
  };

  const compact = async () => {
    let canvas = await qrRef.current.querySelector("canvas");
    let qrFile = await canvas.toDataURL("image/png");
    // setQrCode(qrFile)
    const qrStorageRef = await ref(storage, "QrImage/" + newTitle);
    const uploadTask = await uploadString(qrStorageRef, qrFile, "data_url");
    getDownloadURL(qrStorageRef).then((url) => {
      addDoc(fileTestCollectionRef, {
        Title: newTitle,
        DocInfo: newDocInfo,
        Link: url,
      });
    });
  };

  const compactFile = async () => {
    let canvas = await qrRef.current.querySelector("canvas");
    let qrFile = await canvas.toDataURL("image/png");
    const qrStorageRef = await ref(storage, "QrImage/" + newTitle);
    const uploadTask = await uploadString(qrStorageRef, qrFile, "data_url");
    getDownloadURL(qrStorageRef).then((url) => {
      addDoc(fileTestCollectionRef, {
        Title: newTitle,
        DocInfo: newDocInfo,
        Link: url,
      });
    });
  };

  const [dataB, setDataB] = useState(true);
  const closeDataList = () => {
    setDataB(!dataB);
  };
  const [file, setFile] = useState(false);
  const closeFile = () => {
    setFile(!file);
  };

  const code = <QRCode level="Q" value={cubeFace.link} />;
  //to shorten links I'm going to have to deploy this first since it needs a domain name.

  return (
    <div className="App">

      {dataB ? (
        <>
        <div>
        <AuthContext/>
        </div>
        </>
      ) : (
        <>
      {file ? (
        <>
        <div className="qr-container__qr-code" ref={qrRef}>
          {code}
        </div>
          <input
            placeholder="Title"
            onChange={(event) => {
              setNewTitle(event.target.value);
            }}
          />
          <input
            placeholder="DocInfo"
            onChange={(event) => {
              setNewDocInfo(event.target.value);
            }}
          />
          <input
            id="link"
            type="text"
            name="link"
            placeholder="add your link"
            value={cubeFace.link}
            onChange={handleQRChange}
          />
          <div>{link}</div>
          <button onClick={compact}> Create Image</button>
          <button onClick={handleLinkUpload}> Upload Image to Storage</button>
          <button onClick={closeFile}>Generate QR code with a File?</button>

          {
            // <button onClick={createTest}> Upload to Database</button>
          }

          {fileTest.map((item, index) => {
            return (
              <div key={index} id={item.id}>
                {""}
                <h1>Title: {item.Title}</h1>
                <h1>Doc Info: {item.DocInfo}</h1>
                <h1>QR Src: {item.Link}</h1>
                <img src={item.Link} />

                <button
                  onClick={() => {
                    updateTest(item.id, item.Title);
                  }}
                >
                  {" "}
                  Update Title
                </button>
                <button
                  onClick={() => {
                    deleteTest(item.id, item.Title);
                  }}
                >
                  {" "}
                  Delete User
                </button>
              </div>
            );
          })}

        </>
      ) : (
        <>
          <div className="qr-container__qr-code" ref={qrRef}>
          {code}
          </div>
          <div>
            {""}
            <div> Uploading an image to storage</div>
            <input
              type="file"
              onChange={(e) => {
                setImage(e.target.files[0]);
              }}
            />
            <button type="button" onClick={handleUpload}>
              UpLoad
            </button>
            <button onClick={closeFile}>Generate QR code with a link?</button>
          </div>
          {fileTest.map((item, index) => {
            return (
              <div key={index} id={item.id}>
                {""}
                <h1>Title: {item.Title}</h1>
                <h1>Doc Info: {item.DocInfo}</h1>
                <h1>QR Src: {item.Link}</h1>
                <img src={item.Link} />

                <button
                  onClick={() => {
                    updateTest(item.id, item.Title);
                  }}
                >
                  {" "}
                  Update Title
                </button>
                <button
                  onClick={() => {
                    deleteTest(item.id, item.Title);
                  }}
                >
                  {" "}
                  Delete User
                </button>
              </div>
            );
          })}
        </>
      )}
      </>
      )}
    </div>
  );
}
