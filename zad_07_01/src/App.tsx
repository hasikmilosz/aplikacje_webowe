import './App.scss'
import Navbar from "./components/Navbar/Navbar.tsx"
import Header from "./components/Header/Header.tsx"
import Footer from "./components/Footer/Footer.tsx"
import {BrowserRouter,Routes,Route} from "react-router";
import Home from "./routes/Home/Home.tsx";
import Contact from "./routes/Contact/Contact.tsx";
import Posts from "./routes/Posts/Posts.tsx";

function App() {
  return (
    <>
        <BrowserRouter>
            <Header/>
            <Navbar/>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/posts" element={<Posts/>}/>
                    <Route path="/contact" element={<Contact/>}/>
                </Routes>
            <Footer/>
        </BrowserRouter>
    </>
  )
}

export default App
