import React, { useEffect, useState } from 'react';
import './exibirOcorrencias.css';
import Header from '../../components/Header';

const ExibirOcorrencias = () => {
  const [ocorrencias, setOcorrencias] = useState([]);

  useEffect(() => {
    const fetchOcorrencias = async () => {
      try {
        const response = await fetch('http://52.14.161.176:3000/ocorrencias');
        const data = await response.json();
        setOcorrencias(data);
      } catch (error) {
        console.error('Erro ao buscar ocorrências:', error);
      }
    };

    fetchOcorrencias();
  }, []);

  return (
    <div className="exibir-ocorrencias-page">
      <Header></Header>
      <div className="exibir-ocorrencias-container">
        <div className="exibir-ocorrencias-ocorrencias-container">
          {ocorrencias.map((ocorrencia) => (
            <div key={ocorrencia.id} className="exibir-ocorrencias-ocorrencia-card">
              <div className="exibir-ocorrencias-ocorrencia-info">
                <p><strong>ID:</strong> {ocorrencia.id}</p>
                <p><strong>Título:</strong> {ocorrencia.titulo}</p>
                <p><strong>Endereço:</strong> {ocorrencia.endereco}</p>
                <p><strong>Data e Hora:</strong> {ocorrencia.dataHora}</p>
                <p><strong>status de Andamento:</strong> {ocorrencia.statusAndamento}</p>
                <p><strong>observação:</strong> {ocorrencia.observacao}</p>

              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="exibir-ocorrencias-image-container">
      </div>
    </div>
  );
};

export default ExibirOcorrencias;
