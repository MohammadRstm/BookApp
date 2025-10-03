import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from './Pages/Home';
import SignUp from './Pages/SignUp';
import LogIn from './Pages/Login';
import BookDetails from './Pages/BookDetails';
import Add_Edit from './Pages/Add_Edit';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addEdit" element={<Add_Edit />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/bookDetails" element={<BookDetails />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
