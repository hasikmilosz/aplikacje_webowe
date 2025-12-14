import { Outlet } from "react-router";

export default function Contact() {
    return (
        <div>
            <h1>Contact</h1>
            <a href="/">Home</a>
            <p></p>
            <a href="/about">About</a>
            <p></p>
            <a href="/contact">Contact</a>
            {/* will either be <Home/> or <Settings/> */}
            <Outlet />
        </div>
    );
}