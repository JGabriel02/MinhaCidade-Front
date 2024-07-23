import React, { useEffect, useState } from 'react';
import './atualizarOcorrencias.css';
import Header from '../../components/Header';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

const AtualizarOcorrencias = () => {
  const [ocorrencias, setOcorrencias] = useState([]);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const fetchOcorrencias = async () => {
      try {
        const response = await fetch('http://52.14.161.176:8081/ocorrencias');
        const data = await response.json();
        setOcorrencias(data);

        const processedData = data
          .filter(ocorrencia => ocorrencia.latitude && ocorrencia.longitude)
          .map(ocorrencia => [ocorrencia.latitude, ocorrencia.longitude, 1]); // Adiciona um valor de 1 para cada ponto

        // Adicione uma verificação de dimensões
        const mapContainer = document.getElementById('heatmap-map');
        if (mapContainer && mapContainer.clientHeight > 0 && mapContainer.clientWidth > 0) {
          if (!map) {
            const newMap = L.map('heatmap-map', {
              center: { lat: -30.035229878185845, lng: -51.226468536689104 },
              zoom: 15,
              maxZoom: 17,
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19,
              attribution: '© OpenStreetMap contributors',
            }).addTo(newMap);

            setMap(newMap);
          } else {
            map.eachLayer((layer) => {
              if (layer instanceof L.HeatLayer) {
                map.removeLayer(layer); // Remove a camada de calor antiga, se houver
              }
            });
          }

          if (processedData.length > 0) {
            L.heatLayer(processedData, { radius: 25 }).addTo(map);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar ocorrências:', error);
      }
    };

    fetchOcorrencias();
  }, [map]);

  return (
    <div className="atualizar-ocorrencias-page">
      <Header />
      <div className="atualizar-ocorrencias-container">
        <div className="atualizar-ocorrencias-left-container">
          <div className="atualizar-ocorrencias-ocorrencias-container">
            {ocorrencias.map((ocorrencia) => (
              <div key={ocorrencia.id} className="atualizar-ocorrencias-ocorrencia-card">
                <div className="atualizar-ocorrencias-ocorrencia-info">
                  <p>ID: {ocorrencia.id}</p>
                  <p>Título: {ocorrencia.titulo}</p>
                  <p>Estado: {ocorrencia.estado}</p>
                  <p>Rua: {ocorrencia.rua}</p>
                  <p>Data-Hora: {ocorrencia.dataHora}</p>
                </div>
                <div className="atualizar-ocorrencias-ocorrencia-update">
                  <label>Status de Andamento:</label>
                  <input type="text" value={ocorrencia.statusAndamento || ''} />
                  <label>Observações:</label>
                  <input type="text" value={ocorrencia.observacoes || ''} />
                  <button>Atualizar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="atualizar-ocorrencias-right-container">
          <div id="heatmap-map" className="atualizar-ocorrencias-heatmap-map"></div>
        </div>
      </div>
    </div>
  );
};

export default AtualizarOcorrencias;
