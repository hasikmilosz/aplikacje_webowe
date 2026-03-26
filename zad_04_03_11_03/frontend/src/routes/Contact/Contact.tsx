import styles from "./Contact.module.scss"

export default function Contact() {
    return (
        <nav className={styles.Contact}>
            <div>
                <form method="POST" action="#">
                    <label htmlFor="name">Podaj imię: </label>
                    <input type="text" id="name" name="name" placeholder="Imię..." />
                    <label htmlFor="lastName">Podaj nazwisko: </label>
                    <input type="text" id="lastName" name={"lastName"} placeholder={"Nazwisko..."} />
                    <label htmlFor="email">Podaj e-mail: </label>
                    <input type="email" id="email" name={"email"} placeholder={"E-mail..."} />
                    <label htmlFor="mess">Napisz wiadomość: </label>
                    <textarea cols={30} rows={10} name="mess" id={"mess"}></textarea>
                    <input type="submit" value="Potwierdź"></input>
                </form>
            </div>
        </nav>
    )
}