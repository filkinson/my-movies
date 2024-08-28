import Footer from "./Footer";
import Navbar from "./Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Movies from "./pages/Movies";
import Movie from "./pages/Movie";
import Person from "./pages/Person";
import Register from "./pages/Register";
import { Route, Routes } from "react-router-dom";


function App() {
  return (
    <>
      <Navbar />
      <body>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movie" element={<Movie />} />
          <Route path="/person" element={<Person />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
      </body>
      <Footer />
    </>
  )
}

export default App;
