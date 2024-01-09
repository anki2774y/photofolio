import styles from "./Images.module.css";
import {useEffect, useState} from "react";
import {doc, onSnapshot, updateDoc, arrayUnion} from "firebase/firestore";
import {db} from "../firebaseInit";
import ImageModal from "../ImageModal/ImageModal";
import { toast } from "react-toastify";

function Images({albumDetails, setShowHome, notifications}) {
    // Form Details 
    const [showImgForm, setShowImgForm] = useState(false);
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    // for valid URl
    const [isValidUrl, setIsValidUrl] = useState(true);
    // all images
    const [imgList, setImgList] = useState(albumDetails.images);
    // selected image to open
    const [selectedImage, setSelectedImage] = useState(null);
    // searching
    const [searchInput, setSearchInput] = useState('');
    const [searchFilter, setSearchFilter] = useState(false);
    const [filteredData, setFilteredData] = useState(imgList);
    // carousel 
    const [hoveredImg, setHoveredImg] = useState(null);
    const [carouselIndex, setCarouselIndex] = useState(0);
    // to edit the image or title
    const [editMode, setEditMode] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editUrl, setEditUrl] = useState('');
    const [editId, setEditId] = useState(null);

    // Checking if the input is URL or not
    const handleInputChange = (e) => {
        e.preventDefault();
        const inputValue = e.target.value;
        if(editUrl) setEditUrl(editUrl);
        editMode ? setEditUrl(inputValue) : setUrl(inputValue);       
        // Regular expression for a simple URL validation
        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
        // Check if the input value matches the URL pattern
        setIsValidUrl(urlRegex.test(inputValue));
    };

    // Adding New Image
    async function handleImgForm(e) {
        e.preventDefault();   
        if(!isValidUrl) {
            toast("Enter Valid URL");
            return;
        }
        if (editMode) {
            // Update existing image
            if (editTitle && editUrl) {
                const updatedImages = imgList.map((img, index) => {
                    if (index === editId) {
                        return { title: editTitle, src: editUrl };
                    } else {
                        return img;
                    }
                });
                const docRef = doc(db, "albums", albumDetails.id);
                await updateDoc(docRef, {
                    images: updatedImages
                });
                setEditMode(false);
                notifications("Updated Image");
            } else {
                notifications("Empty Field");
            }
        } else {
            // Add new image
            if (title && url) {
                const newImageData = { title, src: url };
                const docRef = doc(db, "albums", albumDetails.id);
                await updateDoc(docRef, {
                    images: arrayUnion(newImageData)
                });
                notifications("Add Image");
            } else {
                notifications("Empty Field");
            }
        }   
        // Reset form fields
        setTitle('');
        setUrl('');
    }

    useEffect(()=> {
        const unsubscribe = onSnapshot(doc(db, "albums", albumDetails.id), (snapshot)=> {
            if (snapshot.exists()) {
                const albumData = snapshot.data();
                const imagesArray = albumData.images || []; // Handle the case where 'images' may be undefined              
                setImgList(imagesArray);
            } else {
            console.log("Document does not exist");
            }     
            // Cleanup function to unsubscribe when the component unmounts
            return () => unsubscribe();
        }, [])
    }, [albumDetails.id]);

    useEffect(() => {
        setFilteredData(imgList);
    }, [imgList]);

    // Open Image using Modal
    const openModal = (src, title, index) => {
        setSelectedImage({ src, title });
        setCarouselIndex(index);
    };

    // To show the Edit and Delete Button
    const handleMouseEnter = (id) => {
        setHoveredImg(id);
    };
    
    // To hide the Edit and Delete Button
    const handleMouseLeave = () => {
        setHoveredImg(null);
    };

    // To Delete the Image 
    async function deleteImage(e, id) {
        e.stopPropagation();  // Prevent event propagation
        const updatedImages = imgList.filter((img, index) => index !== id) 
        const docRef = doc(db, "albums", albumDetails.id);
        await updateDoc(docRef, {
            images: updatedImages
        });
        notifications("Delete Image")
    }

    function editImage(e, id, imgSrc, imgTitle) {
        e.stopPropagation();  // Prevent event propagation
        setEditMode(true);
        setEditTitle(imgTitle);  // Use setEditTitle instead of setTitle
        setEditUrl(imgSrc);      // Use setEditUrl instead of setUrl
        setShowImgForm(true);
        setEditId(id);
    }


    const handleSearch = (e) => {
        e.preventDefault();
        const filteredSearch = imgList.filter(img => {
           return img.title.toLowerCase().includes(e.target.value.toLowerCase());
        });
        setSearchInput(e.target.value);
        setFilteredData(filteredSearch);
    } 
    
    const handleClearSearch = () => {
        setSearchInput('');
        setFilteredData((prevImgList) => {
          setSearchFilter(!searchFilter);
          return imgList;
        });
      };

    function handleCancelOrAdd() {
        setShowImgForm(!showImgForm);
        if (editMode) {
            setEditMode(false);
            setEditTitle('');
            setEditUrl('');
            setEditId(null);
        } else {
            setTitle('');
            setUrl('');
        }
    }

    return (
        <>
            <div className={styles.imgListContainer}>
                {
                    imgList.length === 0
                    ?
                        <div className={styles.imgListCnt}>
                            <span>
                                <img className={styles.back} 
                                src={"https://mellow-seahorse-fc9268.netlify.app/assets/back.png"}  alt="Back"
                                onClick={()=>setShowHome(true)} 
                            />
                            </span>
                            <h3 className={styles.heading}>No images found in the album.</h3>
                            <button className={showImgForm? styles.clear : styles.addImage} onClick={()=>setShowImgForm(!showImgForm)}> {showImgForm ? "Cancel" : "Add Image"} </button>
                        </div>
                    :
                        <div className={styles.imgListCnt}>
                            <span>
                                <img className={styles.back}
                                    src={"https://mellow-seahorse-fc9268.netlify.app/assets/back.png"}
                                    onClick={() => setShowHome(true)}
                                    alt="back"
                                />
                            </span>
                            <h3 className={styles.heading}> Images in {albumDetails.id} </h3>
                            <div className={styles.srchCnt}>
                                {
                                    searchFilter
                                    ?
                                        <>
                                            <input className={styles.srchInput} value={searchInput} placeholder="Search..." onChange={handleSearch} />
                                            <img
                                                className={styles.back} 
                                                src={"https://mellow-seahorse-fc9268.netlify.app/assets/clear.png"}
                                                alt="Clear"
                                                onClick={()=>setSearchFilter(!searchFilter)}                                                 
                                            />
                                        </>
                                    :
                                        <img 
                                            className={styles.back} 
                                            src={"https://mellow-seahorse-fc9268.netlify.app/assets/search.png"} 
                                            alt="Search"
                                            onClick={handleClearSearch} 
                                        />
                                }
                            </div>
                            <button 
                                className={showImgForm ? styles.clear : styles.addImage} 
                                onClick={handleCancelOrAdd}
                            > 
                                {showImgForm ? "Cancel" : "Add Image"} 
                            </button>
                        </div>
                }

                {
                    showImgForm &&
                    <div className={styles.imgformCnt}>
                        <p className={styles.urImg}>{editMode ? "Edit image" : `Add image to ${albumDetails.id}`}</p>
                        <form className={styles.imgForm}>
                            <input
                                className={styles.imgTitle}
                                type={"text"}
                                placeholder={"Title"}
                                value={editMode ? editTitle : title}
                                onChange={(e) => editMode ? setEditTitle(e.target.value) : setTitle(e.target.value)}
                                required
                            />
                            <input
                                className={styles.imgSrc}
                                type={"text"}
                                placeholder={"Image URL"}
                                value={editMode ? editUrl : url}
                                onChange={handleInputChange}
                                style={{ borderColor: isValidUrl ? '' : (url ? 'red' : '') }}
                                required
                            />
                            <div className={styles.imgFormActions}>
                                <button
                                    className={styles.imgFormActionBtn}
                                    type="button"
                                    onClick={() => { setEditMode(false); setTitle(''); setUrl(''); setEditTitle(''); setEditUrl(''); }}
                                >
                                    Clear
                                </button>
                                <button className={styles.imgFormActionBtn} onClick={handleImgForm}>
                                    {editMode ? "Update" : "Add"}
                                </button>
                            </div>
                        </form>
                    </div>
                }


                <div className={styles.imglistCnt}>
                    {imgList && filteredData.map((img, id)=> {
                        return (
                            <>
                                <div key={id} className={styles.imgList} onClick={() => openModal(img.src, img.title, id)} onMouseEnter={() => handleMouseEnter(id)} onMouseLeave={handleMouseLeave}>
                                    <div 
                                        className={`${styles.editBtn} ${hoveredImg === id ? styles.show : ''}`}
                                        onClick={(e) => editImage(e, id, img.src, img.title)}
                                    >
                                        <img src="https://cdn-icons-png.flaticon.com/128/10336/10336114.png" alt="Edit" />
                                    </div>
                                    <div 
                                        className={`${styles.deleteBtn} ${hoveredImg === id ? styles.show : ''}`} 
                                        onClick={(e) => deleteImage(e, id)}
                                    >
                                        <img src="https://mellow-seahorse-fc9268.netlify.app/assets/trash-bin.png" alt="Del" />
                                    </div>
                                    <img 
                                        className={styles.image}
                                        src={img.src}
                                        alt={img.title}
                                    />
                                    <span className={styles.albmName}>{img.title}</span>
                                    
                                </div>
                                
                            </>
                        )
                    })}
                </div>

                {/* Display the modal when an image is clicked */}
                {selectedImage && (
                    <div className={styles.carouselOverlay}>
                        <ImageModal
                            src={selectedImage.src}
                            title={selectedImage.title}
                            filteredData={filteredData}
                            imgList={imgList}
                            setSelectedImage={setSelectedImage}
                            initialIndex={carouselIndex}
                        />
                    </div>
                )}
            </div>
        </>
    )
}

export default Images;