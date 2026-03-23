import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

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
  </StrictMode>,
)
