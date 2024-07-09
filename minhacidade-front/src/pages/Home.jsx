import React from 'react';
import './Home.css'; 
import logo from '../../src/img/logo.png'
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
                    <p>
                        O APP “minha cidade” é um HUB de informações<br />
                        Que facilita a disseminação de informações úteis ao cidadão<br />
                        Ao contrário dos sites oficiais (156+ etc...)<br />
                        O produto é simples e prático. <br />
                        Basta apertar o botão abaixo, o usuário será redirecioando ao formulario de registro, onde escolhe o tipo de evento, localiza e fornece a data e a hora da ocorrência
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
