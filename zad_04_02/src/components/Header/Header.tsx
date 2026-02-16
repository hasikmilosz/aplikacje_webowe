import styles from "./Header.module.scss"
import {useLocation} from "react-router"

export default function Header(){
    const location = useLocation()

    const getPageTitle = () => {
        switch(location.pathname) {
            case '/':
                return 'Strona główna'
            case '/posts':
                return 'Wpisy'
            case '/contact':
                return 'Kontakt'
            default:
                return "Wpis"
    }}

    return (
        <>
            <header className={styles.Header}>
                <h1>{getPageTitle()}</h1>
            </header>
        </>
    )
}