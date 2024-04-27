import Compra from '@app/models/Compra';
import axios from 'axios';

export const getComprasRequest = async () => await axios.get('http://localhost:4000/compras');
export const createCompraRequest = async(compra: Compra) =>await axios.post('http://localhost:4000/compras',compra);
export const deleteCompraRequest = async(id: any,compra:Compra) =>await axios.put('http://localhost:4000/deleteCompras/'+id);
export const updateCompraRequest = async(id: any,compra:Compra) =>await axios.put('http://localhost:4000/compras/'+id,compra);
export const getCompraRequest = async(id:any) =>await axios.get('http://localhost:4000/compras/'+id);