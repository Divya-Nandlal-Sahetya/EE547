import "./App.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import  Dashboard from "./Components/Dashboard";
import SignInPage from "./Components/Login";

  
function App() {
  return (
    <BrowserRouter>
        <div>
            <Routes>
                <Route path="/" element={<SignInPage/>} /> 
                <Route path="/dashboard" element={<Dashboard/>} />
            </Routes>
        </div>
        
    </BrowserRouter>

)
}

export default App;
