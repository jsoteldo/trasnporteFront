import Marca from '@app/models/Marcas';
import axios from 'axios';

export const getMarcasRequest = async () => await axios.get('http://localhost:4000/marcas');
export const createMarcaRequest = async(marca: Marca) =>await axios.post('http://localhost:4000/marcas',marca);
export const deleteMarcaRequest = async(id: any,marca:Marca) =>await axios.put('http://localhost:4000/deleteMarcas/'+id);
export const updateMarcaRequest = async(id: any,marca:Marca) =>await axios.put('http://localhost:4000/marcas/'+id,marca);
export const getMarcaRequest = async(id:any) =>await axios.get('http://localhost:4000/marcas/'+id);