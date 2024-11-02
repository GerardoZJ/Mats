import React from 'react';
import './Desing/ContactoDesing.css';
import camionImage from '../../public/camion.jpg'; // Asegúrate de que la ruta de la imagen sea correcta

const Contacto = () => {
  return (
    <div className="contacto-page">
      <div className="contacto-split-container">
        <div className="contacto-image-section">
          <img src={camionImage} alt="Camión" />
          <div className="contacto-overlay">
            <h2>Materiales Rojo</h2>
            <p>Tu socio en construcción y materiales de calidad.</p>
          </div>
        </div>
        <div className="contacto-info-section">
          <h2>Información de Contacto</h2>
          <p><strong>Teléfono:</strong> (55) 1234-5678</p>
          <p><strong>Correo:</strong> contacto@materialesrojo.com</p>
          <p><strong>Dirección:</strong> Calle Ejemplo, No. 123, Ciudad, País</p>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
