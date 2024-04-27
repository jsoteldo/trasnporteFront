import CargaMasivaReq from '@app/models/CargaMasivaReq';
import Objetos from '@app/models/Objetos';
import axios from 'axios';

export const getObjetosRequest = async () => await axios.get('http://localhost:4000/objetos');
export const createObjetoRequest = async(objeto: Objetos) =>await axios.post('http://localhost:4000/objetos',objeto);
export const deleteObjetoRequest = async(id: any,objeto:Objetos) =>await axios.put('http://localhost:4000/deleteObjetos/'+id);
export const updateObjetoRequest = async(id: any,objeto:Objetos) =>await axios.put('http://localhost:4000/objetos/'+id,objeto);
export const getObjetoRequest = async(id:any) =>await axios.get('http://localhost:4000/objetos/'+id);
export const cargaMasivaRequest = async(cargaMasivaReq: CargaMasivaReq) =>await axios.post('http://localhost:4000/cargaMasiva/',cargaMasivaReq);