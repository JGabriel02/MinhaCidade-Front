import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import './cadEndereco.css';
import Header from '../../components/Header';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const CadastroOcorrencia = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [map, setMap] = useState(null);
  const [geocoder, setGeocoder] = useState(null);
  const [marker, setMarker] = useState(null);
  const [addressFields, setAddressFields] = useState({
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: ''
  });

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

      let marker = null; 

      initialMap.addListener('click', async (event) => {
        const { latLng } = event;
        const lat = latLng.lat();
        const lng = latLng.lng();
        setLatitude(lat);
        setLongitude(lng);

        if (marker) {
          marker.setMap(null); 
        }

        marker = new window.google.maps.Marker({
          position: { lat, lng },
          map: initialMap,
        });

        try {
          const results = await geocoderInstance.geocode({ location: { lat, lng } });
          if (results.results.length > 0) {
            const addressComponents = results.results[0].address_components;
            const addressObj = {
              rua: addressComponents.find(component => component.types.includes('route'))?.long_name || '',
              numero: addressComponents.find(component => component.types.includes('street_number'))?.long_name || '',
              bairro: addressComponents.find(component => component.types.includes('sublocality_level_1'))?.long_name || '',
              cidade: addressComponents.find(component => component.types.includes('administrative_area_level_2'))?.long_name || '',
              estado: addressComponents.find(component => component.types.includes('administrative_area_level_1'))?.short_name || '',
            };
            setAddressFields(addressObj);
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
  }, [marker]);

  const handleAddressChange = (values, setFieldValue) => {
    const address = `${values.rua}, ${values.numero}, ${values.bairro}, ${values.cidade}, ${values.estado}`;
    geocoder.geocode({ address: address })
      .then((results) => {
        if (results.results.length > 0) {
          const { lat, lng } = results.results[0].geometry.location;
          setLatitude(lat());
          setLongitude(lng());

          
          if (marker) {
            marker.setMap(null);
          }

         
          const newMarker = new window.google.maps.Marker({
            position: { lat: lat(), lng: lng() },
            map: map,
          });
          setMarker(newMarker);
          map.setCenter({ lat: lat(), lng: lng() });
        } else {
          alert('Endereço não encontrado.');
        }
      })
      .catch((error) => {
        console.error('Erro ao buscar endereço:', error);
        alert('Erro ao buscar endereço. Tente novamente.');
      });
  };

  const validationSchema = Yup.object().shape({
    titulo: Yup.string().required('Título é obrigatório'),
    descricao: Yup.string().required('Descrição é obrigatória'),
    tipo: Yup.string().required('Tipo é obrigatório'),
    estado: Yup.string().required('Estado é obrigatório'),
    cidade: Yup.string().required('Cidade é obrigatória'),
    bairro: Yup.string().required('Bairro é obrigatório'),
    rua: Yup.string().required('Rua é obrigatória'),
    numero: Yup.string().required('Número é obrigatório'),
    dataHora: Yup.date().required('Data e hora são obrigatórias'),
    email: Yup.string().email('Email inválido').required('Email é obrigatório'),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    if (!latitude || !longitude) {
      alert('Selecione uma localização no mapa!');
      setSubmitting(false);
      return;
    }

    const formData = {
      ...values,
      endereco: `${values.rua}, ${values.numero}, ${values.bairro}, ${values.cidade}, ${values.estado}`,
      latitude,
      longitude
    };

    fetch('http://52.14.161.176:8081/cadastrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.text())
      .then(data => {
        alert('Ocorrência cadastrada com sucesso!');
        resetForm();
        setLatitude(null);
        setLongitude(null);
        map.setCenter({ lat: -30.035229878185845, lng: -51.226468536689104 });
        map.setZoom(15);
        if (marker) {
          marker.setMap(null);
        }
        setMarker(null);
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Falha ao cadastrar ocorrência. Tente novamente.');
      });

    emailjs.send('service_z0i22hr', 'template_b1g8umf', formData, 'm1VZ2-glXWP2g3z3S')
      .then((response) => {
        alert('E-mail enviado com sucesso!');
      }, (error) => {
        console.error('Falha ao enviar e-mail:', error);
        alert('Falha ao enviar e-mail. Tente novamente.');
      });

    setSubmitting(false);
  };

  return (
    <div>
      <Header />
      <div className="container">
        <Formik
          initialValues={{
            titulo: '',
            descricao: '',
            tipo: '',
            estado: '',
            cidade: '',
            bairro: '',
            rua: '',
            numero: '',
            dataHora: '',
            email: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form>
              <h1 className='titulo'>Cadastrar Ocorrencia</h1>
              <p>Titulo:</p>
              <Field type="text" name="titulo" />
              <ErrorMessage name="titulo" component="div" className="error" />

              <p>Descrição:</p>
              <Field type="text" name="descricao" />
              <ErrorMessage name="descricao" component="div" className="error" />

              <p>Tipo:</p>
              <Field as="select" name="tipo">
                <option value="" disabled>--Selecione o tipo de ocorrência--</option>
                <option value="assaltoFurto">Assalto/Furto</option>
                <option value="asfaltoCalcada">Problema no asfalto/calçada</option>
                <option value="aguaLuz">Falta de água/luz</option>
              </Field>
              <ErrorMessage name="tipo" component="div" className="error" />

              <p>Estado:</p>
              <Field type="text" name="estado" value={values.estado || addressFields.estado} onChange={(e) => {
                setFieldValue('estado', e.target.value);
                setAddressFields({ ...addressFields, estado: e.target.value });
              }} />
              <ErrorMessage name="estado" component="div" className="error" />

              <p>Cidade:</p>
              <Field type="text" name="cidade" value={values.cidade || addressFields.cidade} onChange={(e) => {
                setFieldValue('cidade', e.target.value);
                setAddressFields({ ...addressFields, cidade: e.target.value });
              }} />
              <ErrorMessage name="cidade" component="div" className="error" />

              <p>Bairro:</p>
              <Field type="text" name="bairro" value={values.bairro || addressFields.bairro} onChange={(e) => {
                setFieldValue('bairro', e.target.value);
                setAddressFields({ ...addressFields, bairro: e.target.value });
              }} />
              <ErrorMessage name="bairro" component="div" className="error" />

              <p>Rua:</p>
              <Field type="text" name="rua" value={values.rua || addressFields.rua} onChange={(e) => {
                setFieldValue('rua', e.target.value);
                setAddressFields({ ...addressFields, rua: e.target.value });
              }} />
              <ErrorMessage name="rua" component="div" className="error" />

              <p>Numero:</p>
              <Field type="text" name="numero" value={values.numero || addressFields.numero} onChange={(e) => {
                setFieldValue('numero', e.target.value);
                setAddressFields({ ...addressFields, numero: e.target.value });
              }} />
              <ErrorMessage name="numero" component="div" className="error" />

              <p>Data e Hora:</p>
              <Field type="datetime-local" name="dataHora" />
              <ErrorMessage name="dataHora" component="div" className="error" />

              <p>E-mail:</p>
              <Field type="email" name="email" />
              <ErrorMessage name="email" component="div" className="error" />

              <button type="button" onClick={() => handleAddressChange(values, setFieldValue)}>Buscar Endereço</button>

              <button type="submit" disabled={isSubmitting}>Cadastrar</button>
            </Form>
          )}
        </Formik>
        <div id="map" style={{ height: '400px', width: '100%' }}></div>
      </div>
    </div>
  );
};

export default CadastroOcorrencia;
