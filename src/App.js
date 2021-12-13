import {db} from './firebase-config'
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

  useEffect(()=>{
    //this is getting and setting all items from the collection. I'll refernce how i've written stuff like this before.
    const getFileTest = async () =>{
      const data = await getDocs(fileTestCollectionRef)
      console.log(data)
      setFileTest(data.docs.map((doc)=>({...doc.data(), id: doc.id})))
    }

    getFileTest()
  },[])
// have to look at this. Changed the onChange from the scaleable functino to a prop. It messed up because of the "name"
  const createTest = async () => {
    await addDoc(fileTestCollectionRef, {Title: newTitle, docInfo: newDocInfo})
  }
  return (
    <div className="App">
    <input
      name="Title"
      placeholder="Title"
      onChange={handleTitleChange}
    />
    <input
      name="DocInfo"
      placeholder="DocInfo"
      onChange={handleDocInfoChange}
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
          </div>
        )
      })}
    </div>
  );
}

export default App;
