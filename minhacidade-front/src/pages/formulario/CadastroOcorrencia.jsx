import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import './cadEndereco.css';
import Header from '../../components/Header';

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
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [map, setMap] = useState(null);
  const [geocoder, setGeocoder] = useState(null);
  const [marker, setMarker] = useState(null); // Adicionado para armazenar o marcador

  useEffect(() => {
    const initMap = () => {
      const initialMap = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: -30.035229878185845, lng: -51.226468536689104 },
        zoom: 15,
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
      });

      const geocoderInstance = new window.google.maps.Geocoder();
      setGeocoder(geocoderInstance);
      setMap(initialMap);

      let marker = null; // variável para armazenar o marcador

      initialMap.addListener('click', async (event) => {
        const { latLng } = event;
        const lat = latLng.lat();
        const lng = latLng.lng();
        setLatitude(lat);
        setLongitude(lng);

        if (marker) {
          marker.setMap(null); // Remove o marcador antigo
        }

        marker = new window.google.maps.Marker({
          position: { lat, lng },
          map: initialMap,
        });


        // Geocodificando o endereço baseado na localização do clique
        try {
          const results = await geocoderInstance.geocode({ location: { lat, lng } });
          if (results.results.length > 0) {
            const addressComponents = results.results[0].address_components;
            const address = addressComponents.map(component => component.long_name).join(', ');
            const addressArray = address.split(', ');
            const addressObj = {
              rua: addressArray[0] || '',
              numero: addressArray[1] || '',
              bairro: addressArray[2] || '',
              cidade: addressArray[3] || '',
              estado: addressArray[4] || '',
            };
            setRua(addressObj.rua);
            setNumero(addressObj.numero);
            setBairro(addressObj.bairro);
            setCidade(addressObj.cidade);
            setEstado(addressObj.estado);
            document.getElementById('address').value = address;
          } else {
            alert('Endereço não encontrado para a localização selecionada.');
          }
        } catch (error) {
          console.error('Erro ao buscar endereço:', error);
          alert('Erro ao buscar endereço. Tente novamente.');
        }
      });
    };

    if (window.google) {
      initMap();
    } else {
      console.error('Google Maps JavaScript API não carregada');
    }
  }, []);

  const handleAddressChange = () => {
    const address = `${rua}, ${numero}, ${bairro}, ${cidade}, ${estado}`;
    document.getElementById('address').value = address;
    geocoder.geocode({ address: address })
      .then((results) => {
        if (results.results.length > 0) {
          const { lat, lng } = results.results[0].geometry.location;
          setLatitude(lat());
          setLongitude(lng());

          // Remove o marcador antigo, se existir
          if (marker) {
            marker.setMap(null);
          }

          // Adiciona um novo marcador no novo endereço
          const newMarker = new window.google.maps.Marker({
            position: { lat: lat(), lng: lng() },
            map: map,
          });
          setMarker(newMarker);

          // Centraliza o mapa no novo endereço
          map.setCenter({ lat: lat(), lng: lng() });

          // Atualiza os campos de endereço com o novo endereço encontrado
          setRua(rua);
          setNumero(numero);
          setBairro(bairro);
          setCidade(cidade);
          setEstado(estado);
        } else {
          alert('Endereço não encontrado.');
        }
      })
      .catch((error) => {
        console.error('Erro ao buscar endereço:', error);
        alert('Erro ao buscar endereço. Tente novamente.');
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verifique se todos os campos estão preenchidos
    if (!titulo || !descricao || !tipo || !estado || !cidade || !bairro || !rua || !numero || !dataHora || !email || !latitude || !longitude) {
      alert('Todos os campos devem ser preenchidos!');
      return;
    }

    const formData = {
      titulo,
      descricao,
      tipo,
      endereco: `${rua}, ${numero}, ${bairro}, ${cidade}, ${estado}`,
      dataHora,
      email,
      latitude,
      longitude
    };

    console.log('Dados do formulário:', formData);

    // Enviar dados para o banco de dados
    fetch('http://52.14.161.176:3000/cadastrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.text())
      .then(data => {
        console.log('Success:', data);
        alert('Ocorrência cadastrada com sucesso!');

        // Limpar os campos do formulário
        setTitulo('');
        setDescricao('');
        setTipo('');
        setEstado('');
        setCidade('');
        setBairro('');
        setRua('');
        setNumero('');
        setDataHora('');
        setEmail('');
        setLatitude(null);
        setLongitude(null);
        document.getElementById('address').value = '';

        // Centralizar o mapa nas coordenadas iniciais e limpar o marcador
        map.setCenter({ lat: -30.035229878185845, lng: -51.226468536689104 });
        map.setZoom(15);
        if (marker) {
          marker.setMap(null);
        }
        setMarker(null); // Atualize o estado do marcador

        // Adiciona um marcador nas coordenadas iniciais
        const initialMarker = new window.google.maps.Marker({
          position: { lat: -30.035229878185845, lng: -51.226468536689104 },
          map: map,
        });
        setMarker(initialMarker);

        setLatitude(-30.035229878185845);
        setLongitude(-51.226468536689104);
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Falha ao cadastrar ocorrência. Tente novamente.');
      });

    // Enviar e-mail
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
      <Header />
      <div className="container">
        <form onSubmit={handleSubmit}>
          <h1 className='titulo'>Cadastrar Ocorrencia</h1>
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

          <p>Rua</p>
          <input type="text" value={numero} onChange={(e) => setRua(e.target.value)} />

          <p>Numero:</p>
          <input type="text" value={rua} onChange={(e) =>setNumero (e.target.value)} />
          
          <p>Data e Hora:</p>
          <input type="datetime-local" value={dataHora} onChange={(e) => setDataHora(e.target.value)} />

          <p>E-mail:</p>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <input id="address" type="text" readOnly style={{ display: 'none' }}/>

          <button type="button" onClick={handleAddressChange}>Buscar Endereço</button>

          <input type="submit" value="Cadastrar postagem" />
        </form>
        <div id="map" style={{ width: '100%', height: '500px' }}></div>
      </div>
    </div>
  );
};

export default CadastroOcorrencia;
