import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles'; 
import { UserProvider } from './components/UserProvider';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import DashBoard from './components/Dashboard';
import ViewDishes from './components/ViewDishes';
import Results from "./components/Results";
import AdminPanel from './components/Adminpanel';

const users = require("./db/users.json");
const storedUsers = localStorage.getItem('users');
if (!storedUsers) {
  localStorage.setItem("users", JSON.stringify(users));
} 

const theme = createTheme();

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <UserProvider>
          <Toaster position='top-right' />
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/dashboard' element={<DashBoard />} />
            <Route path='/list' element={<ViewDishes />} />
            <Route path='/list/results' element={<Results />} />
            <Route path='/admin' element={<AdminPanel />} />
          </Routes>
        </UserProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
