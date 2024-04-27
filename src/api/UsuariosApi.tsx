//Usuarios.tsx
import Usuarios from '@app/models/Usuarios';
import axios, { AxiosRequestConfig } from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: ".env" });
const storedToken = localStorage.getItem("auth");
const token = storedToken ? JSON.parse(storedToken) : "";

const axiosConfig: AxiosRequestConfig = {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  };

export const getUsuariosRequest = async () => await axios.get(process.env.BACKURI+'/usuarios', axiosConfig);
export const createUsuarioRequest = async(usuario: Usuarios) =>await axios.post(process.env.BACKURI+'/usuarios',usuario);
export const deleteUsuarioRequest = async(id: any,usuario:Usuarios) =>await axios.put(process.env.BACKURI+'/deleteUsuario/'+id, axiosConfig);
export const updateUsuarioRequest = async(id: any,usuario:Usuarios) =>await axios.put(process.env.BACKURI+'/usuarios/'+id,usuario, axiosConfig);
export const getUsuarioRequest = async(id:any) =>await axios.get(process.env.BACKURI+'/usuarios/'+id, axiosConfig);
export const getLoginRequest = async(usuario:Usuarios) =>await axios.post(process.env.BACKURI+'/usuariosLogin/',usuario);

//get login