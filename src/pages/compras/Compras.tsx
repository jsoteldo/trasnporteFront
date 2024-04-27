import React, { useState } from 'react';
import { TextField, Button, TableContainer, Table, TableHead, TableBody, TableCell, TableRow, Select, MenuItem, FormControl, InputLabel, Grid, Box, makeStyles } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const getTextFieldStyles = () => ({
  width: '100%', // Establece el ancho al 100% del contenedor
  // Agregar media queries para diferentes tamaños de pantalla
  '@media (min-width:600px)': {
    width: '100%', // Reducir el ancho a la mitad en dispositivos sm (tablets, etc.)
  },
  '@media (min-width:960px)': {
    width: '100%', // Reducir aún más el ancho en dispositivos md (escritorio, etc.)
  },
  '@media (min-width:1280px)': {
    width: '100%', // Ajustar el ancho en dispositivos lg (pantallas grandes)
  },
  '@media (min-width:1920px)': {
    width: '100%', // Ajuste adicional para pantallas xl (pantallas extra grandes)
  },
});



const Compras: React.FC = () => {
  const textFieldStyles = getTextFieldStyles();
  const [lugar, setLugar] = useState<string>('');
  const [producto, setProducto] = useState({
    nombre: '',
    cantidad: 0,
    marca: '',
    presentacion: 'litros' as 'litros' | 'mililitros' | 'gramos' | 'kilogramos' | '',
    precioUnitario: '',
    peso: ''
  });
  const [productos, setProductos] = useState<any[]>([]);
  const [totalGeneral, setTotalGeneral] = useState<number>(0);
  const [formaDePago, setFormaDePago] = useState<string>('divisas');
  const [montoLocal, setMontoLocal] = useState<string>('');
  const [montoDivisas, setMontoDivisas] = useState<string>('');
  const arreglo = ["litros", "mililitros", "gramos","kilogramos"];

  const productoForm = useFormik({
    initialValues: {
      lugar: '',
      producto: {
        nombre: '',
        cantidad: 0,
        marca: '',
        presentacion: '',
        precioUnitario: '',
        peso: '',
      },
    },
    validationSchema: Yup.object({
      lugar: Yup.string().required('El Proveedor del artículo es obligatorio'),
      producto: Yup.object({
        nombre: Yup.string().required('El nombre del artículo es obligatorio'),
        cantidad: Yup.number().min(1, 'La cantidad debe ser mayor que cero').required('La cantidad es obligatoria'),
        marca: Yup.string().required('La marca es obligatoria'),
        presentacion: Yup.string().required('La presentación es obligatoria'),
        precioUnitario: Yup.string().required('El precio unitario es obligatorio'),
        peso: Yup.number().when('presentacion', {
          is: (presentacion) => arreglo.includes(presentacion),
          then: Yup.number().required('El peso es obligatorio'),
        }),
      }),
    }),
    onSubmit: (values) => {
      // Aquí puedes manejar la lógica de agregar el producto a la lista
      console.log('Producto agregado:', values.producto);
    },
  });


  const handleAgregarProducto = () => {

    productoForm.validateForm().then((errors) => {
      // Verificar si hay errores
      if (Object.keys(errors).length === 0) {
        // No hay errores, proceder a agregar el producto
        const precioTotal =
          producto.cantidad * parseFloat(producto.precioUnitario.replace(/\./g, '').replace(',', '.'));
        const nuevoProducto = { ...producto, precioTotal };
        setProductos([...productos, nuevoProducto]);
        setProducto({
          nombre: '',
          cantidad: 0,
          marca: '',
          presentacion: '',
          precioUnitario: '',
          peso: '',
        });

        const total = productos.reduce((acc, curr) => acc + (curr.precioTotal || 0), 0);
        setTotalGeneral(total);
      }
    });


      const precioTotal = producto.cantidad * parseFloat(producto.precioUnitario.replace(/\./g, '').replace(',', '.'));
      const nuevoProducto = { ...producto, precioTotal };
      setProductos([...productos, nuevoProducto]);
      setProducto({
        nombre: '',
        cantidad: 0,
        marca: '',
        presentacion: '',
        precioUnitario: '',
        peso: ''
      });

      const total = productos.reduce((acc, curr) => acc + (curr.precioTotal || 0), 0);
      setTotalGeneral(total);
  };

  

  const handleEliminarProducto = (index: number) => {
    const nuevosProductos = [...productos];
    nuevosProductos.splice(index, 1);
    setProductos(nuevosProductos);

    const total = nuevosProductos.reduce((acc, curr) => acc + (curr.precioTotal || 0), 0);
    setTotalGeneral(total);
  };

  const handleEditarProducto = (index: number) => {
    const productoEditar = productos[index];
    setProducto(productoEditar);
    handleEliminarProducto(index);
  };

  const handleGenerarCompra = () => {
    // Aquí puedes enviar la compra al backend o realizar otras acciones necesarias
    console.log('Compra generada:', { lugar, productos, totalGeneral, formaDePago, montoLocal, montoDivisas });
  };

  const [peso, setPeso] = useState<number | ''>('');
  const [unidad, setUnidad] = useState<'litros' | 'mililitros' | 'kilogramos' | 'gramos'>('litros');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPeso(value === '' ? '' : parseFloat(value));
  };

  const handleUnidadChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setUnidad(event.target.value as 'litros' | 'mililitros' | 'kilogramos' | 'gramos');
  };

  return (
    <section className="content ">
        <div className="container-fluid ">
          <div className="row mx-auto">
            <div className="col-md-6 mx-auto">
              <div className="card card-primary card-outline h-auto ">
              
                <div className="card-header">
                  <h3 className="card-title">Compras de Productos</h3>
                </div>
                <div className="card-body" >
                  <div className="form-group">
                  <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <TextField
                        name="codigo"
                        id="filled-basic"
                        label="Proveedor"
                        variant="standard"
                        value={productoForm.values.lugar}
                        onChange={productoForm.handleChange}
                        error={productoForm.touched.lugar && Boolean(productoForm.errors.lugar)}
                        helperText={productoForm.touched.lugar && productoForm.errors.lugar}
                        sx={textFieldStyles}
                        color="primary"
                      />
                    
                  </Grid>
                  <Grid item xs={7} sm={7}>
                    <TextField
                      label="Nombre del Artículo"
                      value={productoForm.values.producto.nombre}
                      onChange={productoForm.handleChange}
                      error={productoForm.touched.producto?.nombre && Boolean(productoForm.errors.producto?.nombre)}
                      helperText={productoForm.touched.producto?.nombre && productoForm.errors.producto?.nombre}
                      variant="standard"
                      sx={textFieldStyles}
                    />
                  </Grid>

                  <Grid item xs={4} sm={2}>
                    <FormControl fullWidth variant="standard">
                      <InputLabel htmlFor="presentacion" >Presentación</InputLabel>
                      <div style={{ display: 'flex', marginTop: '16px'}}>
                        <Grid item xs={6} sm={6}>
                          <TextField
                            id="presentacion"
                            placeholder="Peso"
                            type="number"
                            value={productoForm.values.producto.peso}
                            onChange={productoForm.handleChange}
                            error={productoForm.touched.producto?.peso && Boolean(productoForm.errors.producto?.peso)}
                            helperText={productoForm.touched.producto?.peso && productoForm.errors.producto?.peso}
                            fullWidth
                            variant="standard"
                            color="primary"
                          />
                        </Grid>
                        <Grid item xs={6} sm={6}>
                          <Select
                             value={productoForm.values.producto.presentacion}
                             onChange={productoForm.handleChange}
                             error={productoForm.touched.producto?.presentacion && Boolean(productoForm.errors.producto?.presentacion)}
                            fullWidth
                            variant="standard"
                            sx={{ height: '100%' }}
                            color="primary"
                          >
                            <MenuItem value="l">L</MenuItem>
                            <MenuItem value="ml">ml</MenuItem>
                            <MenuItem value="k">Kg</MenuItem>
                            <MenuItem value="g">g</MenuItem>
                          </Select>
                        </Grid>
                      </div>
                    </FormControl>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <TextField
                      label="Marca"
                      variant="standard"
                      value={productoForm.values.producto.marca}
                      onChange={productoForm.handleChange}
                      error={productoForm.touched.producto?.marca && Boolean(productoForm.errors.producto?.marca)}
                      helperText={productoForm.touched.producto?.marca && productoForm.errors.producto?.marca}
                    />
                  </Grid>


                </Grid>
                  
                <Grid container justifyContent="flex-end"  spacing={2} style={{ marginTop: '5px' }}>
                  <Grid item xs={6} sm={2} >
                    <TextField
                      label="Cantidad"
                      type="number"
                      variant="standard"
                      value={productoForm.values.producto.cantidad}
                      onChange={productoForm.handleChange}
                      error={productoForm.touched.producto?.cantidad && Boolean(productoForm.errors.producto?.cantidad)}
                      helperText={productoForm.touched.producto?.cantidad && productoForm.errors.producto?.cantidad}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3} >
                    <TextField
                      label="Precio Unitario"
                      InputProps=
                      {{
                        endAdornment: <InputAdornment position="end">$</InputAdornment>,
                      }}
                      variant="standard"
                      value={productoForm.values.producto.precioUnitario}
                      onChange={productoForm.handleChange}
                      error={productoForm.touched.producto?.precioUnitario && Boolean(productoForm.errors.producto?.precioUnitario)}
                      helperText={productoForm.touched.producto?.precioUnitario && productoForm.errors.producto?.precioUnitario}
                    />
                  </Grid>
                </Grid>
                  </div>
                <Button variant="contained" onClick={handleAgregarProducto}>Agregar</Button>

                {/* Tabla de productos */}
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Nombre Producto</TableCell>
                        <TableCell>Cantidad</TableCell>
                        <TableCell>Precio Unitario</TableCell>
                        <TableCell>P. Total Producto</TableCell>
                        {/* Resto de encabezados de tabla */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {productos.map((prod, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{prod.nombre}</TableCell>
                          <TableCell>{prod.cantidad}</TableCell>
                          <TableCell>{prod.precioUnitario}</TableCell>
                          <TableCell>{prod.cantidad * prod.precioUnitario}</TableCell>
                          {/* Resto de celdas de la tabla */}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Mostrar el monto total */}
                <Box mt={2}>
                  <InputLabel>Monto Total a Pagar:</InputLabel>
                  <TextField
                    value={totalGeneral}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="standard"
                      
                  />
                </Box>

                {/* Sección de forma de pago */}
                <FormControl>
                  <InputLabel>Forma de Pago</InputLabel>
                  <Select
                    value={formaDePago}
                    onChange={(e) => setFormaDePago(e.target.value as string)}
                  >
                    <MenuItem value="divisas">Divisas</MenuItem>
                    <MenuItem value="monedaLocal">Moneda Local</MenuItem>
                    <MenuItem value="combinado">Combinado</MenuItem>
                  </Select>
                </FormControl>

                {formaDePago === 'combinado' && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Monto en Moneda Local"
                        value={montoLocal}
                        onChange={(e) => setMontoLocal(e.target.value)}
                      />
                    </Grid>
                    {/* Otro campo para el monto en divisas */}
                  </Grid>
                )}

                {/* Botón para generar la compra */}
                <Button variant="contained" onClick={handleGenerarCompra}>Generar Compra</Button>

                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

  );
};

export default Compras;
