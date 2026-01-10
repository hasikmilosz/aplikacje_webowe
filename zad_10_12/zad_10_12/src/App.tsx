import Home from './routes/home.tsx'
import About from './routes/about'
import Contact from './routes/contact'
import './App'
import { BrowserRouter, Routes, Route } from "react-router"

function App() {

  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Home />}/>
              <Route path="/about" element={<About />}/>
              <Route path="/contact" element={<Contact />}/>
          </Routes>
      </BrowserRouter>
  )
}

export default App
