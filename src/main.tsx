import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import { AppContext } from './AppContext';
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <AppContext>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </AppContext>
)
