import React, { useEffect, useState } from 'react';
import './exibirOcorrencias.css';
import Header from '../../components/Header';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

const ExibirOcorrencias = () => {
  const [ocorrencias, setOcorrencias] = useState([]);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const fetchOcorrencias = async () => {
      try {
        const response = await fetch('http://52.14.161.176:3000/ocorrencias');
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
            try {
              L.heatLayer(processedData, {
                radius: 25,
                blur: 15,
                maxZoom: 17,
              }).addTo(map);
            } catch (heatLayerError) {
              console.error('Erro ao adicionar a camada de calor:', heatLayerError);
            }
          } else {
            console.error('Nenhum dado válido para exibir o mapa de calor.');
          }
        } else {
          console.error('O canvas do mapa de calor tem dimensões inválidas.');
        }

      } catch (error) {
        console.error('Erro ao buscar ocorrências:', error);
      }
    };

    fetchOcorrencias();

    const handleResize = () => {
      if (map) {
        map.invalidateSize();
        fetchOcorrencias();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [map]);

  useEffect(() => {
    if (map) {
      map.setView({ lat: -30.035229878185845, lng: -51.226468536689104 }, 15);
    }
  }, [map]);

  return (
    <div className="exibir-ocorrencias-page">
      <Header />
      <div className="exibir-ocorrencias-container">
        <div className="exibir-ocorrencias-left-container">
          <div className="exibir-ocorrencias-ocorrencias-container">
            {ocorrencias.map(ocorrencia => (
              <div key={ocorrencia.id} className="exibir-ocorrencias-ocorrencia-card">
                <div className="exibir-ocorrencias-ocorrencia-info">
                  <p>ID: {ocorrencia.id}</p>
                  <p>Título: {ocorrencia.titulo}</p>
                  <p>Endereço: {ocorrencia.endereco}</p>
                  <p>Data e Hora: {ocorrencia.dataHora}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="exibir-ocorrencias-right-container">
          <div id="heatmap-map" className="exibir-ocorrencias-heatmap-map"></div>
        </div>
      </div>
    </div>
  );
};

export default ExibirOcorrencias;
