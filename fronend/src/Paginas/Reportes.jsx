// Reportes.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Desing/ReportesDesing.css';

const Reportes = () => {
  const [reportes, setReportes] = useState([]);
  const [fecha, setFecha] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('Dia');

  useEffect(() => {
    obtenerReporte();
  }, []);

  const obtenerReporte = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/movimientos');
      setReportes(response.data);
    } catch (error) {
      console.error('Error al obtener el reporte:', error);
    }
  };

  const manejarFiltro = () => {
    // Filtra la lista de reportes según el tipo de filtro (Día, Semana, Mes) y la fecha seleccionada
    console.log(`Filtrando por ${tipoFiltro} en la fecha ${fecha}`);
    // Aquí puedes agregar la lógica de filtrado si es necesario
  };

  return (
    <div className="reportes-container">
      <div className="reportes-header">
        <h2>Reportes de Inventario</h2>
        <div className="filtro-reportes">
          <label>Filtrar por:</label>
          <select value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)}>
            <option value="Dia">Día</option>
            <option value="Semana">Semana</option>
            <option value="Mes">Mes</option>
          </select>
          <input 
            type="date" 
            value={fecha} 
            onChange={(e) => setFecha(e.target.value)} 
          />
          <button onClick={manejarFiltro}>Obtener Reporte</button>
        </div>
      </div>
      
      <div className="reportes-tables">
        <div className="reporte-entradas">
          <h3>Entradas</h3>
          <table>
            <thead>
              <tr>
                <th>ID Movimiento</th>
                <th>Producto</th>
                <th>Fecha</th>
                <th>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {reportes
                .filter((reporte) => reporte.tipo_movimiento === 'entrada')
                .map((reporte) => (
                  <tr key={reporte.id_movimiento}>
                    <td>{reporte.id_movimiento}</td>
                    <td>{reporte.id_material}</td>
                    <td>{new Date(reporte.fecha_movimiento).toLocaleDateString()}</td>
                    <td>{reporte.cantidad}</td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="reporte-salidas">
          <h3>Salidas</h3>
          <table>
            <thead>
              <tr>
                <th>ID Movimiento</th>
                <th>Producto</th>
                <th>Fecha</th>
                <th>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {reportes
                .filter((reporte) => reporte.tipo_movimiento === 'salida')
                .map((reporte) => (
                  <tr key={reporte.id_movimiento}>
                    <td>{reporte.id_movimiento}</td>
                    <td>{reporte.id_material}</td>
                    <td>{new Date(reporte.fecha_movimiento).toLocaleDateString()}</td>
                    <td>{reporte.cantidad}</td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reportes;
