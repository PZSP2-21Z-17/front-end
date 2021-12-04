import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import reportWebVitals from './reportWebVitals';

import './index.css';
import App from './App';
import Home from './routes/Home';
import NotFound from './routes/NotFound';
import Exams from './routes/Exams';
import Questions from './routes/Questions';
import Tags from './routes/Tags';
import PdfUserInterface from './routes/PdfUserInterface';
import LoginInterface from './routes/LoginInterface';
import User from './routes/User';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="" element={<Home />} />
          <Route path="exams" element={<Exams />} />
          <Route path="questions" element={<Questions />} />
          <Route path="tags" element={<Tags />} />
          <Route path="pdfgen" element={<PdfUserInterface customText={'custom text'} />} />
          <Route path="login" element={<LoginInterface />} />
          <Route path="register" element={<LoginInterface />} />
          <Route path="user" element={<User />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();  // https://bit.ly/CRA-vitals, example usage: reportWebVitals(console.log)
