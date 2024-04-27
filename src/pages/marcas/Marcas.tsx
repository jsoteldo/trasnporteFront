import React, { useEffect, useState  } from 'react'
import * as Yup from "yup";
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import { useTheme } from '@mui/material/styles';
import { useMarcas} from '@app/context/MarcasContext';
import {useNavigate, useLocation } from 'react-router-dom';
import Marca from '@app/models/Marcas';

const Marcas = () => {
  const { createMarca, getMarca, updateMarca  } = useMarcas();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [marcaProp, setMarcaProp]  = useState(location.state ? location.state.id : null);
  const [editing, setEditing] = useState(location.state ? location.state.editing : false);
  const [viewing, setViewing] = useState(location.state ? location.state.viewing : false);
  const [marcarError, setMarcarError] = useState(false);
  const [marca, setMarca] =  useState<Marca>();
  useEffect(() => {
    (async () => {
      if (marcaProp) {
        await getMarca(marcaProp).then((response) => {
          if (response) {
            setMarca(response); 
            setFieldTouched('codigo', true);
            setFieldValue('codigo', response.codigo);
            setFieldTouched('descripcion', true);
            setFieldValue('descripcion', response.descripcion);
            if(viewing||editing){
            setMarcarError(false);
          }
          }
          
        });
      }else{
        setMarcarError(true);
      }
    })();
    
  },[marcaProp]);


  const initialValues = {
    codigo:  '',
    descripcion: '',
  };
  
  const enviarForm = async( data:any) => { 
    if (editing) {
      data._id = marcaProp;
      await updateMarca(data);
    } else {
      await createMarca(data);
    }
    navigate('/Marcas');
  }

  const SignupSchema = Yup.object().shape({
    codigo: Yup.string() 
      .min(2, "Too Short!")
      .max(5, "Too Long!")
      .required("Required"),
    descripcion: Yup.string()
      .min(1, "Too Short!")
      .max(70, "Too Long!")
      .required("Required"),
  });
  
  const { handleSubmit, handleChange, values, setFieldValue, setFieldTouched, errors, touched,setFieldError, resetForm } = useFormik({
    initialValues,
    validationSchema: SignupSchema,
    onSubmit: enviarForm,
    enableReinitialize: true
    
  });

  const routeChange = () => {
    let path = `/marcas`;
    navigate(path);
  }
  
  const editMarca = () => {
    setViewing(false);
    setEditing(true);
  }
  
  const customHandleChange = (fieldName:any, newValue:any) => {
    setMarcarError(true)
    setFieldValue(fieldName, newValue);
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
                    {viewing ? 'Visualización' : editing ? 'Actualización' : 'Registro'} de Marcas
                  </h3>
                  {viewing  && marca?.activo && (
                  <a id="back-to-top" href="#" className="btn btn-circle btn-primary btn-md mx-2 float-sm-right" data-toggle="tooltip"
                        title="Volver" role="button" aria-label="Scroll to top" onClick={editMarca}>
                      <i className="fas fa-edit fa-sm"></i>
                  </a>)}

                </div>
                <div className="card-body">
                <form className="Form" onSubmit={handleSubmit}>
                      <div className="card-body">
                        <div className="form-group">
                        <TextField
                          name="codigo"
                          id="filled-basic"
                          label="Código"
                          variant="filled"
                          onChange={(e) => customHandleChange('codigo', e.target.value)}
                          value={values.codigo}
                          error={(marcarError) && !!errors.codigo}
                          helperText={(marcarError) ? errors.codigo : ''}
                          disabled={viewing}
                          InputLabelProps={{
                            shrink:  values.codigo?true:false, 
                          }}
                        />
                        </div>
                        
                        <div className="form-group">
                          <TextField name="descripcion" 
                          id="filled-basic" 
                          label="Descripción" 
                          variant="filled" 
                          onChange={(e) => customHandleChange('descripcion', e.target.value)}
                          value={values.descripcion}
                          error={(marcarError) && !!errors.descripcion}
                          helperText={(marcarError) ? errors.descripcion : ''}
                          disabled={viewing}
                          InputLabelProps={{
                            shrink: values.descripcion?true:false, 
                          }}/>
                        </div>
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

export default Marcas