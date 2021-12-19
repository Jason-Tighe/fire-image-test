import {db, storage, storageRef} from './firebase-config'
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage"

import { collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,} from 'firebase/firestore'
import {useState, useEffect} from 'react'

function App() {
  const [fileTest, setFileTest] = useState([])
  //"test" is the  database and state. Let's keep this going like so.
  const fileTestCollectionRef = collection(db, "fileTest")
  const [newTitle, setNewTitle] = useState("")
  const [newDocInfo, setNewDocInfo] = useState("")
  const [link, setLink] = useState("")

  const [image, setImage] = useState(null)


  const handleChange = e =>{
    if(e.target.files[0]){
      setImage(e.target.files[0])

    }
  }

//
// creating the storage, .ref is the refernce creating a new folder id, ".put" uploading.
// .on, snapshot = current progress, error checking,
const handleUpload = () => {
  const metadata = {
    contentType: 'images/png'
  }
  const storageRef = ref(storage, "Images/"+ image.name);
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
      console.log('File available at', downloadURL);
    })
  }
)

};

// const handleUpload = () => {
//   const uploadTask = storage.ref(`fileTest/${image.name}`).put(image)
//   uploadTask.on(
//     "state_changed",
//     snapshot=>{},
//     error=>{
//       console.log(error)
//     },
//     ()=>{
//       storage
//         .ref("fileTest")
//         .child(image.name)
//         .getDownloadURL()
//         .then(url=>{
//           setLink(url)
//         })
//     }
//   )
// }

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
//broken atm
const getFileTest = async () =>{
  const data = await getDocs(fileTestCollectionRef)
  console.log(data)
  setFileTest(data.docs.map((doc)=>({...doc.data(), id: doc.id})))

  // ref.onSnapshot((querySnapshot)=>{
  //   const items = []
  //   querySnapshot.forEach((doc)=>{
  //     items.push(doc.data())
  //   })
  //   setFileTest(items)
  // })
}

  useEffect(()=>{
    //this is getting and setting all items from the collection. I'll refernce how i've written stuff like this before.


    getFileTest()
  },[])
// have to look at this. Changed the onChange from the scaleable functino to a prop. It messed up because of the "name"
  const createTest = async () => {
    await addDoc(fileTestCollectionRef, {Title: newTitle, docInfo: newDocInfo})
  }

  return (
    <div className="App">
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

    <div>
    <input type="file" onChange={handleChange}/>
    <h1>Here is your Link: {link} </h1>
    <button
    onClick={handleUpload}
    >UpLoad</button>
    <input
      placeholder="Title"
      value={link}
      onChange={(event) => {
         setNewTitle(event.target.value);
       }}
    />
    <button onClick={createTest}> Create User</button>

    </div>

    </div>
  )
}

export default App;
