import styles from "./AlbumList.module.css";
import styles2 from "../Images/Images.module.css"

function AlbumList({albumList, handleOpenAlbum, hoverAlbm, handleMouseEnter, handleMouseLeave, deleteAlbum}) {

    return (
        <>
            <div className={styles.listCnt}>
                {albumList &&
                    albumList.map((list, id) => (
                        <div 
                            key={list.id} 
                            className={styles.albmCnt} 
                            onClick={()=>handleOpenAlbum(list)} 
                            onMouseEnter={() => handleMouseEnter(id)} 
                            onMouseLeave={handleMouseLeave}
                        >
                            <div 
                                className={`${styles2.deleteBtn} ${hoverAlbm === id ? styles2.show : ''}`} 
                                onClick={(e) => deleteAlbum(e, id)}
                            >
                                <img src="https://mellow-seahorse-fc9268.netlify.app/assets/trash-bin.png" alt="Del" />
                            </div>
                            <img
                                className={styles.albmImg}
                                src={"https://mellow-seahorse-fc9268.netlify.app/assets/photos.png"}
                                alt={list.id}
                            />
                            <span className={styles.albmName}>
                                {list.id}
                            </span>
                        </div>
                    ))}
            </div>
        </>
    )
}

export default AlbumList;