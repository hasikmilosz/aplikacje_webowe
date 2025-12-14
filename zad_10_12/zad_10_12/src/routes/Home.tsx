import { Outlet } from "react-router";

export default function Home() {
    return (
        <div>
            <h1>Home</h1>
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