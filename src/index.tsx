import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import reportWebVitals from './reportWebVitals';

import './index.css';
import App from './App';
import Home from './routes/Home';
import NotFound from './routes/NotFound';
import Exams from './routes/Exams';
import Tasks from './routes/Tasks';
import Tags from './routes/Tags';
import Subjects from './routes/Subjects';
import Login from './routes/Login';
import User from './routes/User';
import Register from './routes/Register';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="" element={<Home />} />
          <Route path="exams" element={<Exams />} />
          <Route path="questions" element={<Tasks />} />
          <Route path="tags" element={<Tags />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="user" element={<User />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();  // https://bit.ly/CRA-vitals, example usage: reportWebVitals(console.log)
