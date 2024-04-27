import Producto from '@app/models/Productos';
import axios from 'axios';

export const getProductosRequest = async () => await axios.get('/productos');
export const createProductoRequest = async(producto: Producto) =>await axios.post('/productos',producto);