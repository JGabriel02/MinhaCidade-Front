import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import './cadEndereco.css'; // Certifique-se de que este caminho está correto
import logo from "./img/logo.png"

const CadastroOcorrencia = () => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [dataHora, setDataHora] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      titulo,
      descricao,
      tipo,
      estado,
      cidade,
      bairro,
      rua,
      numero,
      dataHora,
      email,
    };
    console.log('Dados do formulário:', formData);

    emailjs.send('service_z0i22hr', 'template_b1g8umf', formData, 'm1VZ2-glXWP2g3z3S')
      .then((response) => {
        console.log('E-mail enviado com sucesso!', response.status, response.text);
        alert('E-mail enviado com sucesso!');
      }, (error) => {
        console.error('Falha ao enviar e-mail:', error);
        alert('Falha ao enviar e-mail. Tente novamente.');
      });
  };

  return (
    <div>
      <header>
        <img src={logo} alt='' />
        <h1>CADASTRAR OCORRÊNCIA</h1>
      </header>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <p>Titulo:</p>
          <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} />

          <p>Descrição:</p>
          <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} />

          <p>Tipo:</p>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="" disabled>--Selecione o tipo de ocorrência--</option>
            <option value="assaltoFurto">Assalto/Furto</option>
            <option value="asfaltoCalcada">Problema no asfalto/calçada</option>
            <option value="aguaLuz">Falta de água/luz</option>
          </select>

          <p>Estado:</p> 
          <input type="text" value={estado} onChange={(e) => setEstado(e.target.value)} />

          <p>Cidade:</p>
          <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} />

          <p>Bairro:</p>
          <input type="text" value={bairro} onChange={(e) => setBairro(e.target.value)} />

          <p>Rua:</p>
          <input type="text" value={rua} onChange={(e) => setRua(e.target.value)} />

          <p>Número:</p>
          <input type="text" value={numero} onChange={(e) => setNumero(e.target.value)} />

          <p>Data e hora:</p>
          <input type="datetime-local" value={dataHora} onChange={(e) => setDataHora(e.target.value)} />

          <p>Email:</p>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <button type="submit">Cadastrar postagem</button>
        </form>
      </div>
    </div>
  );
};

export default CadastroOcorrencia;
