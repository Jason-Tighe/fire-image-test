import React, {StrictMode} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppRouter from './router/index';
import reportWebVitals from './reportWebVitals';
import App from './App'

const app = document.getElementById('root')

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>, app)
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
