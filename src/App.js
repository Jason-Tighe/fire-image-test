import {db, storage, storageRef} from './firebase-config'
import {getStorage, ref, uploadBytesResumable, getDownloadURL, uploadString} from "firebase/storage"

import { collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot} from 'firebase/firestore'
import {useState, useEffect, useRef} from 'react'
import QRCode from "qrcode.react";


function App() {
  const fileTestCollectionRef = collection(db, "fileTest")
//1
  const [fileTest, setFileTest] = useState([])
//2
  const [newTitle, setNewTitle] = useState("")
//3
  const [newDocInfo, setNewDocInfo] = useState("")
//4
  const [link, setLink] = useState("")
//5
  const [qrCode, setQrCode] =useState(null)
//6
  const [image, setImage] = useState(null)
//7
  const [files, setFiles] = useState();


  const handleChange = e =>{
    if(e.target.files[0]){
      setImage(e.target.files[0])
    }
  }

const [qrName, setQrName] = useState("")
const [cubeFace, setCubeFace] = useState({
    link: ""
  });

//i have to set qrCode to the url String before uploading.
  const handleLinkUpload = (qrFile) => {
    // e.preventDefault();
    const metadata = {
      contentType: 'images/png'
    }
    // Data URL string
    const message = qrFile
    console.log(message)
    const storageRef = ref(storage, "qrLinks/" + qrName);
    const uploadTask = uploadString(storageRef, message, 'data_url')
    };

  const createQrImage = (e) => {
    //prevents reload obv
    e.preventDefault();
    //gets the canvas from the "dom"
    let canvas = qrRef.current.querySelector("canvas");
    //converts the qrRef(the QR code) to an image
    //I might just need set "image" as something
    let qrFile = canvas.toDataURL("image/png");
    setQrCode(qrFile)

    handleLinkUpload(qrFile)
    // setCubeFace({
    //   link: ""
    // });
    // setQrName("");
  };



const qrRef = useRef();
//this basically creates the image and allows us to download the image.
const downloadQRCode = (e, props) => {
  //prevents reload obv
  e.preventDefault();
  //gets the canvas from the "dom"
  let canvas = qrRef.current.querySelector("canvas");
  console.log(canvas);
  //converts the qrRef(the QR code) to an image
  //I might just need set "image" as something
  let image = canvas.toDataURL("image/png");
  console.log(image);
  //creates an anchor tag
  let anchor = document.createElement("a");
  //makes the href of the tag to be the image
  anchor.href = image;
  //the name of the download
  //does not work if just using {qrName}, just use qrName
  anchor.download = qrName
  console.log(qrName)
  //mounts the anchor
  document.body.appendChild(anchor);
  //this is function that causes the download
  anchor.click();
  //unmounts the anchor
  document.body.removeChild(anchor);

  setCubeFace({
    link: ""
  });
  setQrName("");
};

const handleQRChange = (e) => {
    setCubeFace({ ...cubeFace, [e.target.name]: e.target.value });
  };

const handleNameChange = (e)=>{
  setQrName(e.target.value )
}


  const code = (
     <QRCode
       level="Q"
       value={cubeFace.link}
     />
   );


// creating the storage, .ref is the refernce creating a new folder id, ".put" uploading.
// .on, snapshot = current progress, error checking,
const handleUpload = () => {
  const metadata = {
    contentType: 'images/png'
  }
  const storageRef = ref(storage, "Images/" + image.name);
  const uploadTask = uploadBytesResumable(storageRef, image, metadata)
  uploadTask.on('state_changed',
  (snapshot) => {
    },
  (error) =>{
    console.log("oops")
  },
  () =>{
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      setLink(downloadURL)
      setCubeFace({
        link: downloadURL
      })
      setQrName(image.name)
      console.log('File available at', downloadURL);
    })
  }
)

};


const handleTitleChange = e => {
  setNewTitle({ ...newTitle, [e.target.name]: e.target.value });
};

const handleDocInfoChange = e => {
  setNewDocInfo({ ...newDocInfo, [e.target.name]: e.target.value});
};

const updateTest = async (id, docInfo)=>{
  const testDoc = doc(db, "fileTest", id)
  const newFields = {docInfo: ""}
  await updateDoc(testDoc, newFields)
}

const deleteTest = async (id) =>{
  const testDoc = doc(db, "fileTest", id)
  await deleteDoc(testDoc)
}

const getFileTest = async () =>{
  const abc = onSnapshot(fileTestCollectionRef, (querySnapshot)=>{
    const items = []
    querySnapshot.forEach((doc)=>{
      items.push(doc.data())
    })
    setFileTest(items)
  })
}

  useEffect(()=>{
    getFileTest()
  },[])
// have to look at this. Changed the onChange from the scaleable functino to a prop. It messed up because of the "name"
  const createTest = async () => {
    await addDoc(fileTestCollectionRef, {Title: newTitle, docInfo: newDocInfo})
  }

  const [dataB, setDataB] = useState(false);
  const closeDataList = () =>{
    setDataB(!dataB)
  }
  const [file, setFile] = useState(false);
  const closeFile = () =>{
    setFile(!file)
  }
  return (
    <div className="App">
    {dataB ? <></> : <>
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
    <button onClick={createTest}> Create User</button>

    {//this is itterating through the array of items in the collection. There is only 1 atm.
    //things to build out is the rest of the CRUD.
    }
      {fileTest.map((item)=>{
        return(
          <div key={item.id}>
          {""}
          <h1>Title: {item.Title}</h1>
          <h1>Doc Info: {item.docInfo}</h1>
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
        )
      })}
      </>}
    {file ? <></> :
    <>
    <div>
    {""}
    <div> Uploading an image to storage</div>
    <input type="file" onChange={handleChange}/>
    <button
    onClick={handleUpload}
    >UpLoad</button>
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
    </>}

    <>
    <form onSubmit={downloadQRCode}>
       <h1>Hello QRCode Test</h1>
       <input
        id="title"
        type="text"
        name="name"
        placeholder="name your file"

        value={qrName}
        onChange={handleNameChange}
       />
       <lable htmlFor="qrName">Image Name </lable>
       <input
       id="link"
       type="text"
       name="link"
       placeholder="add your link"

       value={cubeFace.link}
       onChange={handleQRChange}
       />
       <lable htmlFor="link"> Link </lable>
       <input
       id="test"
       type="text"
       name="link"
       placeholder="add your link"

       value={qrCode}
       onChange={(e) => setQrCode(e.target.value)}
       />
       <lable htmlFor="link"> base64 </lable>

     <h2>Add a link!</h2>

     {""}
     <button type="submit"> Download QR code image </button>
     <button onClick={createQrImage}> convert to url string </button>
     <button onClick={handleLinkUpload}> Upload newly generated QR Image </button>

   </form>
     <div className="qr-container__qr-code" ref={qrRef}>
      {code}
     </div>
    </>

    </div>
  )
}

export default App;
