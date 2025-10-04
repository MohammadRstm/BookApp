import { useEffect, useState } from "react";
import { BookOpen, Home, Plus, LogIn, LogOut } from 'lucide-react';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() =>{
    if(localStorage.getItem('token')){
        setIsAuthenticated(true);
    }else{
        setIsAuthenticated(false);
    }
  }, [localStorage])

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    window.location.reload();
  };

  return (
    <header className="bg-[#CFC1B4] border-b-2 border-[#C19C82] rounded-b-3xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-[#C19C82] p-3 rounded-xl shadow-sm">
              <BookOpen className="h-7 w-7 text-[#111111]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#111111]">BookStore</h1>
              <p className="text-sm text-[#111111]/80">Your Reading Haven</p>
            </div>
          </div>

          {/* Right side - Navigation */}
          <nav className="flex items-center space-x-4">
            <a 
              href="/" 
              className="flex items-center space-x-2 text-[#111111] hover:text-[#C19C82] font-medium transition-all duration-200 px-4 py-2 rounded-xl hover:bg-[#EBD0BF] group"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </a>
            
            <a 
              href="/addEdit" 
              className="flex items-center space-x-2 text-[#111111] hover:text-[#C19C82] font-medium transition-all duration-200 px-4 py-2 rounded-xl hover:bg-[#EBD0BF] group"
            >
              <Plus className="h-5 w-5" />
              <span>Add-Edit</span>
            </a>
            
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-[#C19C82] text-[#111111] font-semibold px-5 py-2 rounded-xl hover:bg-[#EBD0BF] transition-all duration-200 shadow-md hover:shadow-lg border border-[#111111]/10"
              >
                <LogOut className='h-5 w-5' />
                <span>LogOut</span>
              </button>
            ) : (
              <a 
                href="/login" 
                className="flex items-center space-x-2 bg-[#C19C82] text-[#111111] font-semibold px-5 py-2 rounded-xl hover:bg-[#EBD0BF] transition-all duration-200 shadow-md hover:shadow-lg border border-[#111111]/10"
              >
                <LogIn className="h-5 w-5" />
                <span>LogIn</span>
              </a>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;