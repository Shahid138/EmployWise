import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';

const EditUserModal = ({ user, onClose, onUpdate, isDarkMode }) => {
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [email, setEmail] = useState(user.email);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.put(`https://reqres.in/api/users/${user.id}`, {
        first_name: firstName,
        last_name: lastName,
        email: email
      });

      onUpdate({
        ...user,
        first_name: firstName,
        last_name: lastName,
        email: email
      });

      onClose();
    } catch (err) {
      setError('Failed to update user. Please try again.');
      console.error('Update user error:', err);
    }
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Edit User</h2>
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteConfirmationModal = ({ user, onClose, onDelete, isDarkMode }) => {
  const [error, setError] = useState('');

  const handleDelete = async () => {
    try {
      await axios.delete(`https://reqres.in/api/users/${user.id}`);
      onDelete(user.id);
      onClose();
    } catch (err) {
      setError('Failed to delete user. Please try again.');
      console.error('Delete user error:', err);
    }
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Confirm Deletion</h2>
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}
        <p className="text-center mb-6 dark:text-gray-300">
          Are you sure you want to delete {user.first_name} {user.last_name}?
        </p>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (isDarkMode) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`https://reqres.in/api/users?page=${currentPage}`);
        setUsers(response.data.data);
        setTotalPages(response.data.total_pages);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch users');
        setIsLoading(false);
        console.error('Fetch users error:', err);
      }
    };

    fetchUsers();
  }, [currentPage]);

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalType('edit');
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setModalType('delete');
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers(users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
  };

  const handleDeleteConfirmed = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setModalType(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
          Loading users...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="text-2xl text-red-600 font-bold">{error}</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'} p-8`}>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
            User List
          </h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <Sun className="text-yellow-500" size={24} />
              ) : (
                <Moon className="text-gray-800" size={24} />
              )}
            </button>
            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map(user => (
            <div 
              key={user.id} 
              className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} shadow-md rounded-lg overflow-hidden transform transition-all hover:scale-105 relative`}
            >
              <img 
                src={user.avatar} 
                alt={`${user.first_name} ${user.last_name}`} 
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">
                  {user.first_name} {user.last_name}
                </h2>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{user.email}</p>
              </div>
              <div className="absolute top-4 right-4 flex space-x-2">
                <button 
                  onClick={() => handleEditUser(user)}
                  className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-1 px-2 rounded"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteUser(user)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center mt-8 space-x-4">
          <button 
            onClick={handlePrevPage} 
            disabled={currentPage === 1}
            className={`${
              currentPage === 1 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-400 hover:bg-blue-500'
            } text-white font-bold py-2 px-4 rounded disabled:opacity-50`}
          >
            Previous
          </button>
          <span className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={handleNextPage} 
            disabled={currentPage === totalPages}
            className={`${
              currentPage === totalPages 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-400 hover:bg-blue-500'
            } text-white font-bold py-2 px-4 rounded disabled:opacity-50`}
          >
            Next
          </button>
        </div>
      </div>

      {modalType === 'edit' && selectedUser && (
        <EditUserModal 
          user={selectedUser} 
          onClose={handleCloseModal}
          onUpdate={handleUpdateUser}
          isDarkMode={isDarkMode}
        />
      )}
      {modalType === 'delete' && selectedUser && (
        <DeleteConfirmationModal 
          user={selectedUser} 
          onClose={handleCloseModal}
          onDelete={handleDeleteConfirmed}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default UserList;