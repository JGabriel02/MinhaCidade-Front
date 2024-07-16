import React, { useEffect, useState } from 'react';
import './atualizarOcorrencias.css';
import Header from '../../components/Header';

const AtualizarOcorrencias = () => {
  const [ocorrencias, setOcorrencias] = useState([]);
  const [atualizando, setAtualizando] = useState(null);

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

  const handleUpdate = async (id) => {
    const status = document.getElementById(`status-${id}`).value;
    const observacao = document.getElementById(`observacao-${id}`).value;
    try {
      const response = await fetch('http://52.14.161.176:3000/attOcorrencia', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status, observacao }),
      });
      if (response.ok) {
        alert('Ocorrência atualizada');
        setAtualizando(null); // Reseta o estado de atualização
      } else {
        console.error('Erro ao atualizar ocorrência:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao atualizar ocorrência:', error);
    }
  };

  return (
    <div className="atualizar-ocorrencias-page">
      <Header className="atualizar-ocorrencias-header" />
      <div className="atualizar-ocorrencias-container">
        <div className="atualizar-ocorrencias-ocorrencias-container">
          {ocorrencias.map((ocorrencia) => (
            <div key={ocorrencia.id} className="atualizar-ocorrencias-ocorrencia-card">
              <div className="atualizar-ocorrencias-ocorrencia-info">
                <p><strong>ID:</strong> {ocorrencia.id}</p>
                <p><strong>Título:</strong> {ocorrencia.titulo}</p>
                <p><strong>Endereço:</strong> {ocorrencia.endereco}</p>
                <p><strong>Data e Hora:</strong> {ocorrencia.dataHora}</p>
                <p><strong>Status Atual:</strong> {ocorrencia.statusAndamento}</p>
              </div>
              <div className="atualizar-ocorrencias-ocorrencia-update">
                <label htmlFor={`status-${ocorrencia.id}`}>Status Andamento:</label>
                <select id={`status-${ocorrencia.id}`}>
                  <option value="Aberto">Aberto</option>
                  <option value="Em atendimento">Em atendimento</option>
                  <option value="Resolvido">Resolvido</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
                <label htmlFor={`observacao-${ocorrencia.id}`}>Observação:</label>
                <input type="text" id={`observacao-${ocorrencia.id}`} />
                <button onClick={() => handleUpdate(ocorrencia.id)}>Atualizar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="atualizar-ocorrencias-image-container">
        {/* A imagem será definida via CSS */}
      </div>
    </div>
  );
};

export default AtualizarOcorrencias;
