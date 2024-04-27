import React, { useEffect, useState  } from 'react'
import * as Yup from "yup";
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import { useTheme } from '@mui/material/styles';
import { useObjetos} from '@app/context/ObjetosContext';
import {useNavigate, useLocation } from 'react-router-dom';
import Objeto from '@app/models/Objetos';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const Objetos = () => {
  const { createObjeto, getObjeto, updateObjeto  } = useObjetos();
  const navigate = useNavigate();
  const location = useLocation();
  const [objetoProp, setObjetoProp]  = useState(location.state ? location.state.id : null);
  const [editing, setEditing] = useState(location.state ? location.state.editing : false);
  const [viewing, setViewing] = useState(location.state ? location.state.viewing : false);
  const [objetoError, setObjetoError] = useState(false);
  const [objeto, setObjeto] =  useState<Objeto>();

  useEffect(() => {
    (async () => {
      if (objetoProp) {
        await getObjeto(objetoProp).then((response) => {
          if (response) {
            setObjeto(response); 
            setFieldTouched('nombre', true);
            setFieldValue('nombre', response.nombre);
            setFieldTouched('campo', true);
            setFieldValue('campo', response.campos);
           /* setFieldTouched('field', true);
            setFieldValue('field', response.campos.headerName);
            setFieldTouched('width', true);
            setFieldValue('width', response.campos.width);*/
            if(viewing||editing){
            setObjetoError(false);
          }
          }
          
        });
      }else{
        setObjetoError(true);
      }
    })();
    
  },[objetoProp]);


  const initialValues = {
    nombre:  '',
    campo: '',
    field:'', 
    width: 0
  };
  
  const enviarForm = async( data:any) => { 
    if (editing) {
      data._id = objetoProp;
      await updateObjeto(data);
    } else {
      await createObjeto(data);
    }
    navigate('/Objetos');
  }

  const SignupSchema = Yup.object().shape({
    nombre: Yup.string() 
      .min(4, "Too Short!")
      .max(15, "Too Long!")
      .required("Requerido"),
    campo: Yup.string()
      .min(3, "Too Short!")
      .max(70, "Too Long!")
      .required("Requerido"),
    field: Yup.string()
      .min(3, "Too Short!")
      .max(70, "Too Long!")
      .required("Requerido"),
    width: Yup.number()
      .min(101, 'Debe ser mayor a 100')
      .max(499, 'Debe ser menor a 500')
      .required('Campo requerido'),
  });
  
  const { handleSubmit, handleChange, values, setFieldValue, setFieldTouched, errors, touched,setFieldError, resetForm } = useFormik({
    initialValues,
    validationSchema: SignupSchema,
    onSubmit: enviarForm,
    enableReinitialize: true
    
  });

  const routeChange = () => {
    let path = `/elementos`;
    navigate(path);
  }
  
  const editObjeto = () => {
    setViewing(false);
    setEditing(true);
  }
  
  const customHandleChange = (fieldName:any, newValue:any) => {
    setObjetoError(true)
    setFieldValue(fieldName, newValue);
  };


  const [registros, setRegistros] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleNuevoRegistro = () => {
    if (editingIndex === null) {
      setRegistros([...registros, { nombre: '', descripcion: '', valor: '' }]);
      setEditingIndex(registros.length); // Start editing the newly added record
    }
  };

  const handleCancelarNuevoRegistro = () => {
    setRegistros(registros.filter((_, i) => i !== editingIndex));
    setEditingIndex(null);
  };

  const handleEliminarRegistro = (index) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este registro?');
    if (confirmDelete) {
      setRegistros(registros.filter((_, i) => i !== index));
      setEditingIndex(null);
    }
  };

  const handleEditarRegistro = (index) => {
    setEditingIndex(index);
  };

  const handleGuardarRegistro = (index) => {
    const registro = registros[index];
    if (registro.nombre && registro.descripcion && registro.valor) {
      setEditingIndex(null);
    }
  };

  const handleCambio = (event, index, field) => {
    const newRegistros = [...registros];
    newRegistros[index][field] = event.target.value;
    setRegistros(newRegistros);
  };


  return (
    <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              <div className="card card-primary card-outline">
              
                <div className="card-header">
                  <h3 className="card-title">
                    <a id="back-to-top" href="#" className="btn btn-circle btn-outline-primary btn-md mx-2" data-toggle="tooltip"
                        title="Volver" role="button" aria-label="Scroll to top" onClick={routeChange}>
                      <i className="fas fa-angle-left fa-lg"></i>
                    </a>
                    {viewing ? 'Visualización' : editing ? 'Actualización' : 'Registro'} de Objetos
                  </h3>
                  {viewing  && objeto?.activo && (
                  <a id="back-to-top" href="#" className="btn btn-circle btn-primary btn-md mx-2 float-sm-right" data-toggle="tooltip"
                        title="Volver" role="button" aria-label="Scroll to top" onClick={editObjeto}>
                      <i className="fas fa-edit fa-sm"></i>
                  </a>)}

                </div>
                <div className="card-body">
                <form className="Form" onSubmit={handleSubmit}>
                      <div className="card-body">
                        <div className="form-group">
                        <TextField
                          name="nombre"
                          id="filled-basic"
                          label="Código"
                          variant="filled"
                          onChange={(e) => customHandleChange('nombre', e.target.value)}
                          value={values.nombre}
                          error={(objetoError) && !!errors.nombre}
                          helperText={(objetoError) ? errors.nombre : ''}
                          disabled={viewing}
                          InputLabelProps={{
                            shrink:  values.nombre?true:false, 
                          }}
                        />
                        </div>
                        
                        <Button variant="contained" color="primary" onClick={handleNuevoRegistro}>
        Nuevo
      </Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registros.map((registro, index) => (
              <TableRow key={index}>
                <TableCell>
                  {editingIndex === index ? (
                    <TextField
                      value={registro.nombre}
                      onChange={(event) => handleCambio(event, index, 'nombre')}
                    />
                  ) : (
                    registro.nombre
                  )}
                </TableCell>
                <TableCell>
                  {editingIndex === index ? (
                    <TextField
                      value={registro.descripcion}
                      onChange={(event) => handleCambio(event, index, 'descripcion')}
                    />
                  ) : (
                    registro.descripcion
                  )}
                </TableCell>
                <TableCell>
                  {editingIndex === index ? (
                    <TextField
                      type="number"
                      value={registro.valor}
                      onChange={(event) => handleCambio(event, index, 'valor')}
                    />
                  ) : (
                    registro.valor
                  )}
                </TableCell>
                <TableCell>
                  {editingIndex === index ? (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleGuardarRegistro(index)}
                      >
                        Guardar
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleCancelarNuevoRegistro}
                      >
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleEliminarRegistro(index)}
                      >
                        Eliminar
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEditarRegistro(index)}
                      >
                        Editar
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
                      </div>
                      
                      {/* /.card-body */}
                      <div className="card-footer">
                        <button type="submit" className="btn btn-primary" disabled={viewing}>
                          {editing ? 'Actualizar' : 'Guardar'}
                        </button>
                      </div>
                      
                    </form>
                </div>
                    
              </div>
            </div>
          </div>
        </div>
      </section>

  )
}

export default Objetos