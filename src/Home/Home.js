import styles from "./Home.module.css";
import AlbumList from "../AlbumList/AlbumList";

function Home({ showForm, setShowForm, addAlbum, albumList, setAlbumList, 
                handleOpenAlbum, albumName, setAlbumName, handleClear, 
                hoverAlbm, handleMouseEnter, handleMouseLeave, deleteAlbum })
{   

    return (
        <>
            <div>
                {
                    showForm
                        &&
                        <div className={styles.formCnt}>
                            <p className={styles.urAlbm}>
                                Create an album
                            </p>
                            <form className={styles.albmForm} onSubmit={addAlbum}>
                                <input 
                                    className={styles.albmName} 
                                    value={albumName} type={"text"} 
                                    placeholder={"Album Name"} 
                                    onChange={(e)=>setAlbumName(e.target.value)}
                                />
                                <button className={styles.formBtn} type="button" onClick={handleClear}>
                                    Clear
                                </button>
                                <button className={styles.formBtn} type="submit">
                                    {showForm ? "Create" : "Update"}
                                </button>
                            </form>
                        </div>
                }
                <div className={styles.addAlbmCnt}>
                    <p className={styles.urAlbm}> Your Albums </p>
                    <button 
                        className={showForm? styles.clear : styles.addAlbm} 
                        onClick={() => setShowForm(!showForm)}
                    > 
                        {showForm ? "Clear" :"Add album"} 
                    </ button>
                </div>
            </div>
            <AlbumList 
                albumList={albumList} setAlbumList={setAlbumList} 
                handleOpenAlbum={handleOpenAlbum} 
                hoverAlbm={hoverAlbm} 
                handleMouseEnter={handleMouseEnter} 
                handleMouseLeave={handleMouseLeave} 
                deleteAlbum={deleteAlbum} 
                setShowForm={setShowForm} 
            />
        </>
    )
}

export default Home;