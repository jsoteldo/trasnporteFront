import { createContext, useContext, useState, useEffect } from 'react';
import { getObjetosRequest, createObjetoRequest, deleteObjetoRequest, getObjetoRequest, updateObjetoRequest,cargaMasivaRequest } from '../api/ObjetosApi';
import Objetos from '@app/models/Objetos';
import CargaMasivaReq from '@app/models/CargaMasivaReq';

interface ObjetosContextValue {
  response: any;
  objetos: Objetos[];
  setObjetos: React.Dispatch<React.SetStateAction<Objetos[]>>;
  getObjetos: () => Promise<void>;
  createObjeto: (objeto: Objetos) => Promise<void>;
  deleteObjeto: (objeto:Objetos) => Promise<void>;
  getObjeto: (id:any) => Promise<Objetos>;
  updateObjeto:(objeto:Objetos) => Promise<void>;
  uploadObjets: (cargaMasivaReq: CargaMasivaReq)=> Promise<void>;
}

const ObjetosContext = createContext<ObjetosContextValue | undefined>(undefined);

export const useObjetos = (): ObjetosContextValue => {
  const context = useContext(ObjetosContext);
  if (!context) {
    throw new Error('useObjetos debe ser utilizado dentro de un ObjetosProvider');
  }
  return context;
};

export const ObjetosProvider: React.FC = ({ children }:any) => {
  const [objetos, setObjetos] = useState<Objetos[]>([]);
  const [response, setResponse] = useState();

  const getObjetos = async () => {
    try {
      const res = await getObjetosRequest();
      setObjetos(res.data);
    } catch (error) {
      console.error('Error al obtener los objetos:', error);
    }
  };

  const createObjeto = async (objeto: Objetos) => {
    try {
      console.log(objeto);
      const res = await createObjetoRequest(objeto);
      setObjetos([...objetos, res.data]);
    } catch (error) {
      console.error('Error al crear el objeto:', error);
    }
  };

  const deleteObjeto = async (objeto: Objetos) => {
    try {
      const res = await deleteObjetoRequest(objeto._id,objeto);
      if(res.status === 204){
        setObjetos(objetos.filter((m) => m._id !== objeto._id));
      }
    } catch (error) {
      console.error('Error al Eliminar el objeto:', error);
    }
  };

  const updateObjeto = async (objeto: Objetos) => {
    try {
      const res = await updateObjetoRequest(objeto._id, objeto);
      if(res.status === 204){
        setObjetos(objetos.map((m) => (m._id !== objeto._id ? res.data : m)));
      }
    } catch (error) {
      console.error('Error al Eliminar el objeto:', error);
    }
  };

  const getObjeto = async (id:any) => {
    const res = await getObjetoRequest(id);
    return(res.data)
  }

  const uploadObjets = async (cargaMasivaReq: CargaMasivaReq) => {
    try {
      console.log(cargaMasivaReq);
      const res = await cargaMasivaRequest(cargaMasivaReq);
      setResponse(res.data);
    } catch (error) {
      console.error('Error al efectuar la carga masiva:', error);
    }
  };

  useEffect(() => {
    getObjetos();
  }, []);

  const contextValue: ObjetosContextValue = {
    response,
    objetos,
    setObjetos,
    getObjetos,
    createObjeto,
    deleteObjeto,
    getObjeto,
    updateObjeto,
    uploadObjets
  };

  return (
    <ObjetosContext.Provider value={contextValue}>
      {children}
    </ObjetosContext.Provider>
  );
};