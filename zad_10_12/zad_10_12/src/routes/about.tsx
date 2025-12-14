import { Outlet } from "react-router";

export default function About() {
    return (
        <div>
            <h1>About</h1>
            {/* will either be <Home/> or <Settings/> */}
            <a href="/">Home</a>
            <p></p>
            <a href="/about">About</a>
            <p></p>
            <a href="/contact">Contact</a>
            <Outlet />
        </div>
    );
}