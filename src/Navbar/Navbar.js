import styles from "./Navbar.module.css";
function Navbar({setShowHome}) {
    return (
        <>
            <div className={styles.navCnt} onClick={()=>setShowHome(true)} >
                <img className={styles.navLogo} src={'https://mellow-seahorse-fc9268.netlify.app/assets/logo.png'} alt={"PhotofolioApp"}/>
                <h1 className={styles.navName}> Photofolio App </h1>
            </div>
        </>
    )
}

export default Navbar;