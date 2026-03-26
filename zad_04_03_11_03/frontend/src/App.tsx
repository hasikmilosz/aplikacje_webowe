import './App.scss'
import Navbar from "./components/Navbar/Navbar.tsx"
import Header from "./components/Header/Header.tsx"
import Footer from "./components/Footer/Footer.tsx"
import {BrowserRouter, Routes, Route} from "react-router";
import Home from "./routes/Home/Home.tsx";
import Contact from "./routes/Contact/Contact.tsx";
import Posts from "./routes/Posts/Posts.tsx";
import Post from "./components/Post/Post.tsx"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minut
            gcTime: 1000 * 60 * 10, // 10 minut
        },
    },
})

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Header/>
                <Navbar/>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/posts" element={<Posts/>}/>
                    <Route path="/contact" element={<Contact/>}/>
                    <Route path="/posts/:id" element={<Post/>}/>
                </Routes>
                <Footer/>
            </BrowserRouter>

            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}

export default App