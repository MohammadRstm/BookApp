import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState , useEffect} from 'react';
import Home from './Pages/Home';
import SignUp from './Pages/SignUp';
import LogIn from './Pages/Login';
import BookDetails from './Pages/BookDetails';
import Add_Edit from './Pages/Add_Edit';
import Header from './Pages/Components/Header';

// add some of the "impressive features they wanted in the requirements"
// try to deploy the app today


function App() {

 const [isDarkMode, setIsDarkMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize dark mode from localStorage and apply immediately
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const initialDarkMode = savedMode ? JSON.parse(savedMode) : false;
    
    setIsDarkMode(initialDarkMode);
    
    // Apply the class immediately before React renders
    const htmlElement = document.documentElement;
    if (initialDarkMode) {
      htmlElement.classList.add('dark');
      htmlElement.classList.remove('light');
    } else {
      htmlElement.classList.add('light');
      htmlElement.classList.remove('dark');
    }
    
    setIsInitialized(true);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    
    // Apply the class to the html element
    const htmlElement = document.documentElement;
    if (newMode) {
      htmlElement.classList.add('dark');
      htmlElement.classList.remove('light');
    } else {
      htmlElement.classList.add('light');
      htmlElement.classList.remove('dark');
    }
  };

  // Don't render until dark mode is initialized to prevent flash
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-secondary)] mx-auto mb-4"></div>
          <p className="text-[var(--color-text)]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] transition-colors duration-300">
      <Router>
          <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}/>
          <main>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/addEdit" element={<Add_Edit />} />
                <Route path="/login" element={<LogIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/bookDetails" element={<BookDetails />} />
              </Routes>
          </main>
        </Router>
    </div>
    </>
  );
}

export default App
