import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Home, Plus, LogIn, LogOut, Moon, Sun } from 'lucide-react';

const Header = ({ isDarkMode, toggleDarkMode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if(localStorage.getItem('token')){
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [])

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    // window.location.reload();
  };

  return (
    <header className="bg-[var(--color-primary)] border-b-2 border-[var(--color-secondary)] rounded-b-3xl transition-colors duration-300">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Dark Mode Toggle */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="bg-[var(--color-secondary)] p-3 rounded-xl shadow-sm transition-colors duration-300">
                <BookOpen className="h-7 w-7 text-[var(--color-text)]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[var(--color-text)]">
                  BookStore
                </h1>
                <p className="text-sm text-[var(--color-text)]/80">
                  Your Reading Haven
                </p>
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-secondary)] transition-all duration-200 border border-[var(--color-secondary)] text-[var(--color-text)]"
            >
              {isDarkMode ? (
                <>
                  <Sun className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">Light</span>
                </>
              ) : (
                <>
                  <Moon className="h-5 w-5" />
                  <span className="font-medium">Dark</span>
                </>
              )}
            </button>
          </div>

          {/* Right side - Navigation */}
          <nav className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-[var(--color-text)] hover:text-[var(--color-secondary)] font-medium transition-all duration-200 px-4 py-2 rounded-xl hover:bg-[var(--color-accent)] group"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            
            <Link 
              to="/addEdit" 
              className="flex items-center space-x-2 text-[var(--color-text)] hover:text-[var(--color-secondary)] font-medium transition-all duration-200 px-4 py-2 rounded-xl hover:bg-[var(--color-accent)] group"
            >
              <Plus className="h-5 w-5" />
              <span>Add-Edit</span>
            </Link>
            
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-[var(--color-secondary)] text-[var(--color-text)] font-semibold px-5 py-2 rounded-xl hover:bg-[var(--color-accent)] transition-all duration-200 shadow-md hover:shadow-lg border border-[var(--color-text)]/10"
              >
                <LogOut className='h-5 w-5' />
                <span>LogOut</span>
              </button>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center space-x-2 bg-[var(--color-secondary)] text-[var(--color-text)] font-semibold px-5 py-2 rounded-xl hover:bg-[var(--color-accent)] transition-all duration-200 shadow-md hover:shadow-lg border border-[var(--color-text)]/10"
              >
                <LogIn className="h-5 w-5" />
                <span>LogIn</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;