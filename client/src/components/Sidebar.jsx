import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="h-screen w-64 bg-gray-800 text-white fixed left-0 top-0">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-8">Course Gen AI</h2>
        <nav className="space-y-4">
          <Link 
            to="/dashboard/courses" 
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
          >
            Show Courses
          </Link>
          <Link 
            to="/dashboard/create" 
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
          >
            Create Course
          </Link>
          <Link 
            to="/dashboard/compiler" 
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
          >
            Code Compiler
          </Link>
          <Link 
            to="/dashboard/interview" 
            className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            Interview Practice
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 text-red-400"
          >
            Logout
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;