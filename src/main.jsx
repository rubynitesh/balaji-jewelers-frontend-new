import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// ✅ ADD THIS (Toast CSS)
import "react-toastify/dist/ReactToastify.css";

// ✅ ADD THIS (Toast Container)
import { ToastContainer } from "react-toastify";



import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import Login from './pages/Login.jsx'
import'../src/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <App />
    {/* <Login/> */}

    {/* ✅ ADD THIS: Toast Container (Global Notification System) */}
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false} // progress bar show hoga
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
    />
  </StrictMode>,
)
