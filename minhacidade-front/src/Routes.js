import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home.jsx';
import Cadastro from './pages/formulario/CadastroOcorrencia.jsx';
import ExibirOcorrencias from './pages/exibir/ExibirOcorrencias.jsx'
import AtualizarOcorrencias from './pages/att/AtualizarOcorrencias.jsx';


function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/CadastroOcorrencia" element={<Cadastro />} />
                <Route path="/ocorrencias" element={<ExibirOcorrencias />} />
                <Route path="/attocorrencias" element={<AtualizarOcorrencias />} />
                </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;