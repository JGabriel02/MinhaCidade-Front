import React from 'react';
import './Home.css'; 
import logo from '../../../src/img/logo.png'
import { useNavigate } from 'react-router-dom';


function Home() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/CadastroOcorrencia'); // Navega para a página About
    };
    return (
        <div className="container">
            <div className="color">
                <figure className="header">
                    <img src={logo}alt="Minha Cidade" />
                </figure>
                <section>
                    <p>Bem-vindo! Você está no Minha Cidade!<br />
                    Mais do que um aplicativo, é uma revolução na forma como você interage com a sua cidade. <br />
                    Com funcionalidades abrangentes, o Minha Cidade coloca informações essenciais nas suas mãos.<br />
                    É fácil,  simples e vai direto para os responsáveis.<br />
                    Não é necessário ficar procurando onde solicitar, registrar  ou onde reclamar.<br />
                    A cidade é das pessoas.  É feita por elas, para elas. <br />
                    Faça sua parte e registre aqui o que você precisa.<br />
                    Use e se surpreenda!
                        
                    </p>
                    <br />
                    <br />
                    <input className="btn" type="button" value="Entrar" onClick={handleClick}/>
                </section>
            </div>
        </div>
    );
}

export default Home;