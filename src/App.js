import { db, storage, storageRef } from "./firebase-config";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadString,
  listAll,
  list,
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
  const [link, setLink] = useState("");
  //5
  const [qrCode, setQrCode] = useState("");
  //6
  const [image, setImage] = useState(null);
  //7
  const [files, setFiles] = useState();
//8
  const [qrName, setQrName] = useState("");
//9
  const [cubeFace, setCubeFace] = useState({
    link: "",
  });
//This uploads the image and then generates the url and sets it.
  const handleLinkUpload = (qrFile) => {
    const qrStorageRef = ref(storage, "Images/QrImage/" + newTitle);
    const uploadTask = uploadString(qrStorageRef, qrFile, "data_url");
    getDownloadURL(qrStorageRef)
    .then((url) => {
      setLink(url);
    });
    .then(() => {
      createTest()
    });

  };

  const createQrImage = () => {

    let canvas = qrRef.current.querySelector("canvas");
    let qrFile = canvas.toDataURL("image/png");
    setQrCode(qrFile);
    handleLinkUpload(qrFile);
    //clear states
    // setCubeFace({
    //   link: "",
    // });
    // setQrName("")
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
    anchor.download = qrName;
    console.log(qrName);

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    setCubeFace({
      link: "",
    });
    setQrName("");
  };

  const handleQRChange = (e) => {
    setCubeFace({ ...cubeFace, [e.target.name]: e.target.value });
  };

  const handleNameChange = (e) => {
    setQrName(e.target.value);
  };

  const code = <QRCode level="Q" value={cubeFace.link} />;

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
          setQrName(image.name);

          createQrImage();
          console.log("File available at", downloadURL);
        });
      }
    );
  };

  const handleTitleChange = (e) => {
    setNewTitle({ ...newTitle, [e.target.name]: e.target.value });
  };

  const handleDocInfoChange = (e) => {
    setNewDocInfo({ ...newDocInfo, [e.target.name]: e.target.value });
  };

  const updateTest = async (id, docInfo) => {
    const testDoc = doc(db, "fileTest", id);
    const newFields = { docInfo: "" };
    await updateDoc(testDoc, newFields);
  };

  //does not work atm lol
  const deleteTest = async (id) => {
    const testDoc = doc(db, "fileTest", id);
    await deleteDoc(testDoc);
  };

  const getFileTest = async () => {
    const abc = onSnapshot(fileTestCollectionRef, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      setFileTest(items);
    });
  };
  //I'm going to have to create the CRUD for pushing jsut the urls? the refs? to a database.
  //I'll have to think out the schema(s)/Will have to think more about it once i decide if i'm passing a ref, or just the Url.
  //IF it's just a link, Title, Description, QRcode image Url?
  useEffect(() => {
    getFileTest();
  }, []);
  // have to look at this. Changed the onChange from the scaleable functino to a prop. It messed up because of the "name"

  //I'll have to pass the URL.
  const createTest = async () => {
    console.log(newTitle, newDocInfo, link)
    await addDoc(fileTestCollectionRef, {
      Title: newTitle,
      docInfo: newDocInfo,
      link: link,
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
          <button onClick={createQrImage}> Create User</button>

          {
            //this is itterating through the array of items in the collection. There is only 1 atm.
            //things to build out is the rest of the CRUD.
          }
          {fileTest.map((item, index) => {
            return (
              <div key={index} id={item.id}>
                {""}
                <h1>Title: {item.Title}</h1>
                <h1>Doc Info: {item.docInfo}</h1>
                <h1>QR Src: {item.link}</h1>
                <img src={item.link} />

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
            {/* basically the handleupload needs to be recreated for the new image to work.
      basically, once it creates a the image with downloadQRcode i would then need to fill this input as with that new file?
      maybe if i just do an if statement of like
      "If value state is 0 then "", else valueState?" Can I even do something like this?
      Maybe it'd just be best to create a second input pass the value into that like regular

      */}
            <h1>Here is your Link: {link} </h1>

            <input
              placeholder="Title"
              value={link}
              onChange={(event) => {
                setNewTitle(event.target.value);
              }}
            />
            <button onClick={createTest}> Create User</button>
          </div>
          <img src={link} alt="..." />
        </>
      )}

      <>
        <form onSubmit={downloadQRCode}>
          <h1>Hello QRCode Test</h1>
          <input
            id="title"
            type="text"
            name="name"
            placeholder="name your file"
            value={newTitle}
            onChange={handleTitleChange}
          />
          <label htmlFor="qrName">Image Name </label>
          <input
            id="link"
            type="text"
            name="link"
            placeholder="add your link"
            value={cubeFace.link}
            onChange={handleQRChange}
          />
          <label htmlFor="link"> Link </label>
          <input
            id="test"
            type="text"
            name="link"
            placeholder="add your link"
            value={qrCode}
            onChange={(e) => setQrCode(e.target.value)}
          />
          <label htmlFor="link"> base64 </label>

          <h2>Add a link!</h2>

          {""}

          <button type="submit"> Just download a png of the qr code </button>
          <button type="button" onClick={createQrImage}>
            {" "}
            convert qr code to an image and push to database
          </button>
          <button type="button" onClick={handleLinkUpload}>
            {" "}
            push to database{" "}
          </button>
        </form>
        <div className="qr-container__qr-code" ref={qrRef}>
          {code}
        </div>
      </>
    </div>
  );
}

export default App;
