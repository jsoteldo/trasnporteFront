import React, { useState } from 'react'
import * as Yup from "yup";
import TextField from '@mui/material/TextField';
import { Button, Card, CardActions, CardContent, InputAdornment } from '@mui/material';
import { useFormik } from 'formik';
import FindMarcas from '../marcas/FindMarcas';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Marca from '@app/models/Marcas';


const Productos = () => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Marca>();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [searchText, setSearchText] = useState('');
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  let valoresIniciales = {
    name:"",
    email:""
  }
  
  const enviarForm = ( data:any ) =>{ 
    console.log(data)
  }

  const SignupSchema = Yup.object({
    name: Yup.string()
      .min(2, "Too Short!")
      .max(70, "Too Long!")
      .required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
  });
  
  const {handleSubmit,handleChange, values, setFieldValue, errors} = useFormik({
    initialValues : valoresIniciales,
    validationSchema:SignupSchema,
    onSubmit:enviarForm,

  })


  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = (item: any) => {
    setDialogOpen(false);
    if (item) {
      setSelectedItem(item);
    }
  };
  return (
    <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              <div className="card card-primary">
                <div className="card-header">
                  <h3 className="card-title">Registro de Nuevos Productos</h3>
                </div>
                
                    <form className="Form" onSubmit={handleSubmit}>
                      <div className="card-body">
                        <div className="form-group">
                          <TextField name="name" 
                          id="filled-basic" 
                          label="Código" 
                          variant="filled" 
                          onChange={handleChange} 
                          helperText={errors.name}
                          value={values.name}
                          error={!!errors?.name}/>
                        </div>

                        <div className="form-group">
                          <TextField name="email" 
                          id="filled-basic" 
                          label="Descripción" 
                          variant="filled" 
                          helperText={errors.email}
                          onChange={handleChange} 
                          value={values.email}
                          error={!!errors?.email}/>
                        </div>


                        <TextField
                         value={selectedItem ? selectedItem.nombre : ''}
                         disabled
                         fullWidth
                          placeholder="Marcas..."
                          variant="filled" 
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Button variant="contained" onClick={openDialog}>
                                  <span role="img" aria-label="search">🔍</span>
                                </Button>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </div>
                      
                      
                      {/* /.card-body */}
                      <div className="card-footer">
                        <button type="submit" className="btn btn-primary">
                          Guardar
                        </button>
                      </div>
                      
      <FindMarcas open={dialogOpen} onClose={closeDialog} />
                    </form>
              </div>
            </div>
          </div>
        </div>
      </section>

  )
}

export default Productos
