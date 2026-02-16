import styles from './Navbar.module.scss'
import {Link} from "react-router"

export default function Navbar() {
    return <nav className={styles.Navbar}>
        <Link to={"/"}>Strona główna</Link>
        <Link to={"/posts"}>Wpisy</Link>
        <Link to={"/contact"}>Kontakt</Link>
    </nav>
}