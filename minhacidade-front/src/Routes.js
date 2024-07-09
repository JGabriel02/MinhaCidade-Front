import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Cadastro from './pages/CadastroOcorrencia.jsx';

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/CadastroOcorrencia" element={<Cadastro />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;