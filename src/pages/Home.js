import styles from "./Home.module.css";

export default function Home() {
    return (
    <div className={styles.background}>
    <br></br><br></br>
    <h1>
        <span className={styles.text}>
            Filip Roman's Fabulous
        </span>
        <br></br><br></br>
        <span className={styles.text}>
            Movie Searching Website
        </span>
    </h1>
    </div>
    )
}