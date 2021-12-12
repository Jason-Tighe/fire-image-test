import {db} from './firebase-config'
import {collection, getDocs} from 'firebase/firestore'
import {useState, useEffect} from 'react'

function App() {
  const [fileTest, setFileTest] = useState([])
  //"test" is the state
  const fileTestCollectionRef = collection(db, "fileTest")

  useEffect(()=>{
    const getFileTest = async () =>{
      const data = await getDocs(fileTestCollectionRef)
      console.log(data)
      setFileTest(data.docs.map((doc)=>({...doc.data(), id: doc.id})))
    }

    getFileTest()
  },[])


  return (
    <div className="App">
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
