import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Desing/ReportesDesing.css';

const Reportes = () => {
  const [reportes, setReportes] = useState([]);
  const [fechaExacta, setFechaExacta] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('Dia');
  const [entradasFiltradas, setEntradasFiltradas] = useState([]);
  const [salidasFiltradas, setSalidasFiltradas] = useState([]);

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

  // Convertir fecha UTC de la base de datos a la zona horaria local
  const ajustarFechaAUsuario = (fechaUTC) => {
    const fechaLocal = new Date(fechaUTC);
    return fechaLocal.toLocaleDateString('es-ES');
  };

  const manejarFiltroPorFechaExacta = () => {
    if (!fechaExacta) {
      alert("Por favor selecciona una fecha.");
      return;
    }

    const fechaSeleccionada = new Date(fechaExacta).toLocaleDateString('es-ES');

    const entradas = reportes.filter((reporte) => {
      const fechaMovimiento = new Date(reporte.fecha_movimiento).toLocaleDateString('es-ES');
      return reporte.tipo_movimiento === 'entrada' && fechaMovimiento === fechaSeleccionada;
    });

    const salidas = reportes.filter((reporte) => {
      const fechaMovimiento = new Date(reporte.fecha_movimiento).toLocaleDateString('es-ES');
      return reporte.tipo_movimiento === 'salida' && fechaMovimiento === fechaSeleccionada;
    });

    if (entradas.length === 0 && salidas.length === 0) {
      alert("No hay reportes disponibles para esta fecha.");
    }

    setEntradasFiltradas(entradas);
    setSalidasFiltradas(salidas);
  };

  const manejarFiltroPeriodico = () => {
    const hoy = new Date();
    let fechaInicio;

    switch (tipoFiltro) {
      case 'Dia':
        fechaInicio = new Date(hoy.setHours(0, 0, 0, 0));
        break;
      case 'Semana':
        fechaInicio = new Date(hoy.setDate(hoy.getDate() - 7)).setHours(0, 0, 0, 0);
        break;
      case 'Mes':
        fechaInicio = new Date(hoy.setDate(hoy.getDate() - 30)).setHours(0, 0, 0, 0);
        break;
      default:
        return;
    }

    const entradas = reportes.filter(
      (reporte) =>
        reporte.tipo_movimiento === 'entrada' &&
        new Date(reporte.fecha_movimiento).getTime() >= fechaInicio
    );

    const salidas = reportes.filter(
      (reporte) =>
        reporte.tipo_movimiento === 'salida' &&
        new Date(reporte.fecha_movimiento).getTime() >= fechaInicio
    );

    setEntradasFiltradas(entradas);
    setSalidasFiltradas(salidas);
  };

  return (
    <div className="reportes-container">
      <div className="reportes-header">
        <h2>Reportes de Inventario</h2>
        
        <div className="filtro-reportes">
          <h3 className='texto'>Filtrar Periódicamente</h3>
          <label>Tipo de Filtro:</label>
          <select value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)}>
            <option value="Dia">Día</option>
            <option value="Semana">Semana</option>
            <option value="Mes">Mes</option>
          </select>
          <button onClick={manejarFiltroPeriodico}>Filtrar Periódicamente</button>
          
          <h3 className="texto-negro">Filtrar por Fecha Exacta</h3>
          <input 
            type="date" 
            value={fechaExacta} 
            onChange={(e) => setFechaExacta(e.target.value)} 
          />
          <button onClick={manejarFiltroPorFechaExacta}>Filtrar por Fecha Exacta</button>
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
                <th>Realizado por</th>
              </tr>
            </thead>
            <tbody>
              {entradasFiltradas.length > 0 ? (
                entradasFiltradas.map((reporte) => (
                  <tr key={reporte.id_movimiento}>
                    <td>{reporte.id_movimiento}</td>
                    <td>{reporte.nombre_material || 'Desconocido'}</td>
                    <td>{ajustarFechaAUsuario(reporte.fecha_movimiento)}</td>
                    <td>{reporte.cantidad}</td>
                    <td>{reporte.nombre_admin || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No hay reportes disponibles</td>
                </tr>
              )}
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
                <th>Realizado por</th>
              </tr>
            </thead>
            <tbody>
              {salidasFiltradas.length > 0 ? (
                salidasFiltradas.map((reporte) => (
                  <tr key={reporte.id_movimiento}>
                    <td>{reporte.id_movimiento}</td>
                    <td>{reporte.nombre_material || 'Desconocido'}</td>
                    <td>{ajustarFechaAUsuario(reporte.fecha_movimiento)}</td>
                    <td>{reporte.cantidad}</td>
                    <td>{reporte.nombre_admin || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No hay reportes disponibles</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reportes;
