import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import "@fontsource/poppins";
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import store from './Redux/Store.jsx';
import { SocketProvider } from './common/SocketContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <Provider store={store}>
        <SocketProvider>
          <App />
        </SocketProvider>
      </Provider>
    </BrowserRouter>
)
