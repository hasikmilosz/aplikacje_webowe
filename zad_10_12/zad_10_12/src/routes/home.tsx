import {Link, Outlet} from "react-router";

export default function Home() {
    return (
        <div>
            <h1>Home</h1>
            <br></br>
            <Link to="/">Home</Link>
            <br></br>
            <Link to="/about">About</Link>
            <br></br>
            <Link to="/contact">Contact</Link>
            <Outlet />
        </div>
    );
}