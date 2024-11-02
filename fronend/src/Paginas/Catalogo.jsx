import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Desing/CatalogoDesing.css';
import { useAuth } from '../Componentes/AuthContextt';

const Catalogo = () => {
  const { isAuthenticated } = useAuth();
  const [materiales, setMateriales] = useState([]);
  const [editingMaterialId, setEditingMaterialId] = useState(null);
  const [formValues, setFormValues] = useState({
    nombre: '',
    metros_disponibles: '',
    precio: '',
  });

  useEffect(() => {
    const fetchMateriales = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/materiales');
        setMateriales(response.data);
      } catch (error) {
        console.error('Error al obtener materiales:', error);
      }
    };

    fetchMateriales();
  }, []);

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este material?")) {
      try {
        await axios.delete(`http://localhost:3000/api/materiales/${id}`);
        setMateriales(materiales.filter(material => material.id_material !== id));
      } catch (error) {
        console.error('Error al eliminar material:', error);
      }
    }
  };

  const handleEditar = (material) => {
    setEditingMaterialId(material.id_material);
    setFormValues({
      nombre: material.nombre,
      metros_disponibles: material.metros_disponibles,
      precio: material.precio,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleGuardar = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/materiales/${id}`, formValues);
      setMateriales(materiales.map(material => 
        material.id_material === id ? { ...material, ...formValues } : material
      ));
      setEditingMaterialId(null);
    } catch (error) {
      console.error('Error al actualizar material:', error);
    }
  };

  return (
    <div className="catalogo-container">
      <div className="catalogo-header">
        <h2>Catálogo de Productos</h2>
      </div>
      <div className="catalogo">
        {materiales.map((material) => (
          <div key={material.id_material} className="material-card">
            <img
              src={material.imagen_url || 'https://via.placeholder.com/150'}
              alt={material.nombre}
              className="material-image"
            />
            {editingMaterialId === material.id_material ? (
              <div>
                <input
                  type="text"
                  name="nombre"
                  value={formValues.nombre}
                  onChange={handleChange}
                />
                <input
                  type="number"
                  name="metros_disponibles"
                  value={formValues.metros_disponibles}
                  onChange={handleChange}
                />
                <input
                  type="number"
                  name="precio"
                  value={formValues.precio}
                  onChange={handleChange}
                />
                <button onClick={() => handleGuardar(material.id_material)}>Guardar</button>
                <button onClick={() => setEditingMaterialId(null)}>Cancelar</button>
              </div>
            ) : (
              <div>
                <h3 className="material-name">{material.nombre}</h3>
                <p><strong>Disponible:</strong> {material.metros_disponibles} metros</p>
                <p><strong>Precio:</strong> ${material.precio}</p>
                {isAuthenticated && (
                  <div className="actions">
                    <button onClick={() => handleEditar(material)} className="edit-button">Editar</button>
                    <button onClick={() => handleEliminar(material.id_material)} className="delete-button">Eliminar</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalogo;
