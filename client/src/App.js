import "./App.css"
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import  Dashboard from "./Components/Dashboard";
import SignInPage from "./Components/SignInPage";

  
function App() {
  return (
    <BrowserRouter>
        <div>
            <Routes>
                <Route path="/" element={<Dashboard/>} />
                <Route path="/home" element={<SignInPage/>} />
                <Route path="/dashboard" element={<Dashboard/>} />
            </Routes>
        </div>
        
    </BrowserRouter>

)
}

export default App;
