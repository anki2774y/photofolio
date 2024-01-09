import Navbar from "./Navbar/Navbar";
import Home from "./Home/Home";
import { useEffect, useState } from "react";
import {collection, doc, onSnapshot, setDoc, deleteDoc} from "firebase/firestore";
import {db} from "./firebaseInit";
import Images from "./Images/Images";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  //--- ALBUM ---//
  const [showForm, setShowForm] = useState(false);
  const [showHome, setShowHome] = useState(true);
  const [albumList, setAlbumList] = useState();
  const [albumDetails, setAlbumDetails] = useState();
  const [albumName, setAlbumName] = useState('');
  const [hoverAlbm, setHoveredAlbm] = useState();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "albums"), (snapshot)=> {
      const albums = snapshot.docs.map((doc) => {
        return{
          id: doc.id,
          ...doc.data()
        }
      })
      setAlbumList(albums);
    });

    // Cleanup function to unsubscribe when the component unmounts
    return () => unsubscribe();
  }, [setAlbumList]);

  //--- ALBUM ---//
  // Add New Album
  const addAlbum = async (e) => {
    e.preventDefault();
    const newAlbumName = e.target[0].value;
    
    const isDuplicate = albumList.some(album => album.id === newAlbumName);

    if(isDuplicate) {
      notifications("Duplicate");
      return;
    }

    if (!newAlbumName) {
      notifications("Empty Field");
      return;
    }
    
    try {
      const albumDocRef = doc(db, 'albums', newAlbumName);
      await setDoc(albumDocRef, { images: [] });    
      notifications("Add Album");
    } catch (error) {
      console.error('Error adding album:', error.message);
    }
  }

  // Open Album Handler
  function handleOpenAlbum(albumDetails) {
    setAlbumDetails(albumDetails);
    setShowHome(false);
  }

  // Clear Album Name Field
  function handleClear() {
    setAlbumName('');
  }

  // To show the Edit and Delete Button of ALBUM
  const handleMouseEnter = (id) => {
    setHoveredAlbm(id);
  };
      
  // To hide the Edit and Delete Button of ALBUM
  const handleMouseLeave = () => {
      setHoveredAlbm(null);
  };
  
  // Delete the Album
  async function deleteAlbum(e, id) {
    e.stopPropagation();  // Prevent event propagation
    const docRef = doc(db, "albums", albumList[id].id);
    await deleteDoc(docRef);
    notifications("Delete Album");
  }    

  // Toast Notifications
  function notifications(param) {
    switch (param) {
      case "Empty Field":
        toast("Field Is Empty");
        break;
      case "Add Album":
        toast('Album Added Successfully.');
        break;
      case "Delete Album":
        toast("Album Deleted Successfully")
        break;
      case "Duplicate":
        toast("Name Already Exists");
        break;
      case "Add Image":
        toast("Image Added Successfully");
        break;
      case "Updated Image":
        toast("Image Updated Successfully");
        break;
      case "Delete Image":
        toast("Image Deleted Successfully");
        break;
      default:
        break;
    }
  }

  return (
    <>
      <Navbar showHome={showHome} setShowHome={setShowHome} />
      {
        showHome
        ?
          <Home 
            showForm={showForm} setShowForm={setShowForm}  
            addAlbum={addAlbum} 
            albumList={albumList} setAlbumList={setAlbumList} 
            handleOpenAlbum={handleOpenAlbum} 
            albumName={albumName} setAlbumName={setAlbumName}
            handleClear={handleClear}
            hoverAlbm={hoverAlbm} 
            handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave}
            deleteAlbum={deleteAlbum}
          />
        :
          <Images 
            albumDetails={albumDetails}
            setShowHome={setShowHome}
            notifications={notifications}
          />
      }
      <ToastContainer
        position="top-right"
        autoClose={500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
