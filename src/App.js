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

function App() {
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
  const handleLinkUpload = () => {
    const qrStorageRef = ref(storage, "QrImage/" + newTitle);
    const uploadTask = uploadString(qrStorageRef, qrCode, "data_url")
    getDownloadURL(qrStorageRef).then((url) => {
      setLink(url)
      console.log(url)
      // createTest()
    });
  };


  const createQrImage = () => {

    let canvas = qrRef.current.querySelector("canvas");
    let qrFile = canvas.toDataURL("image/png");
    setQrCode(qrFile);
    // handleLinkUpload(qrFile);
    //clear states
    setCubeFace({
      link: "",
    });
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

          createQrImage();
          console.log("File available at", downloadURL);
        });
      }
    );
  };



  const updateTest = async (id, docInfo) => {
    const testDoc = doc(db, "fileTest", id);
    const newFields = { docInfo: "" };
    await updateDoc(testDoc, newFields);
  };


  const deleteTest = async (id) => {
    const testDoc = doc(db, "fileTest", id);
    await deleteDoc(testDoc);
    deleteStorageTest()
    deleteImgStorageTest()
  };

  // Create a reference to the file to delete
const deleteStorageTest  = async () => {
const deleteQrStorageRef = ref(storage, "QrImage/" + newTitle);

// Delete the file
deleteObject(deleteQrStorageRef).then(() => {
  console.log("nice")
}).catch((error) => {
  console.log("you suck")
})
}
const deleteImgStorageTest  = async () => {
const deleteImgStorageRef = ref(storage, "Images/" + newTitle);

// Delete the file
deleteObject(deleteImgStorageRef).then(() => {
  console.log("nice")
}).catch((error) => {
  console.log("you suck")
})
}

  const getFileTest = async () => {
    const abc = onSnapshot(fileTestCollectionRef, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        // snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}))
        items.push({id: doc.id, ...doc.data()});
      });
      setFileTest(items);
    });
  };


  useEffect(() => {
    getFileTest();
  }, []);

  //I'll have to pass the URL.
  const createTest = () => {
    addDoc(fileTestCollectionRef, {
      Title: newTitle,
      DocInfo: newDocInfo,
      Link: link,
    });
  };

  const [dataB, setDataB] = useState(false);
  const closeDataList = () => {
    setDataB(!dataB);
  };
  const [file, setFile] = useState(false);
  const closeFile = () => {
    setFile(!file);
  };

  const code = <QRCode level="Q" value={cubeFace.link} />;


  return (
    <div className="App">
      {dataB ? (
        <></>
      ) : (
        <>
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
          <button onClick={createQrImage}> Create Image</button>
          <button onClick={handleLinkUpload}> Upload Image to Storage</button>
          <button onClick={createTest}> Upload to Database</button>


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
                  Increase Age
                </button>
                <button
                  onClick={() => {
                    deleteTest(item.id);
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
      {file ? (
        <></>
      ) : (
        <>
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
          </div>
        </>
      )}
      <>
        <div className="qr-container__qr-code" ref={qrRef}>
          {code}
        </div>
      </>
    </div>
  );
}

export default App;
