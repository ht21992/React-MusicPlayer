import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { store } from "./app/Store";
import { Provider } from "react-redux";
import '../static/frontend/css/index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(

  <Provider store={store}>
    <App />
  </Provider>



);

