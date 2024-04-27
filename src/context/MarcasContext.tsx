import { createContext, useContext, useState, useEffect } from 'react';
import { getMarcasRequest, createMarcaRequest, deleteMarcaRequest, getMarcaRequest, updateMarcaRequest } from '../api/MarcasApi';
import Marca from '@app/models/Marcas';

interface MarcasContextValue {
  marcas: Marca[];
  setMarcas: React.Dispatch<React.SetStateAction<Marca[]>>;
  getMarcas: () => Promise<void>;
  createMarca: (marca: Marca) => Promise<void>;
  deleteMarca: (marca:Marca) => Promise<void>;
  getMarca: (id:any) => Promise<Marca>;
  updateMarca:(marca:Marca) => Promise<void>;
}

const MarcasContext = createContext<MarcasContextValue | undefined>(undefined);

export const useMarcas = (): MarcasContextValue => {
  const context = useContext(MarcasContext);
  if (!context) {
    throw new Error('useMarcas debe ser utilizado dentro de un MarcasProvider');
  }
  return context;
};

export const MarcasProvider: React.FC = ({ children }:any) => {
  const [marcas, setMarcas] = useState<Marca[]>([]);

  const getMarcas = async () => {
    try {
      const res = await getMarcasRequest();
      setMarcas(res.data);
    } catch (error) {
      console.error('Error al obtener los marca:', error);
    }
  };

  const createMarca = async (marca: Marca) => {
    try {
      console.log(marca);
      const res = await createMarcaRequest(marca);
      setMarcas([...marcas, res.data]);
    } catch (error) {
      console.error('Error al crear el marca:', error);
    }
  };

  const deleteMarca = async (marca: Marca) => {
    try {
      const res = await deleteMarcaRequest(marca._id,marca);
      if(res.status === 204){
        setMarcas(marcas.filter((m) => m._id !== marca._id));
      }
    } catch (error) {
      console.error('Error al Eliminar la marca:', error);
    }
  };

  const updateMarca = async (marca: Marca) => {
    try {
      console.log("marca a actualizar: "+marca);
      const res = await updateMarcaRequest(marca._id, marca);
      if(res.status === 204){
        setMarcas(marcas.map((m) => (m._id !== marca._id ? res.data : m)));
      }
    } catch (error) {
      console.error('Error al Eliminar la marca:', error);
    }
  };

  const getMarca = async (id:any) => {
    const res = await getMarcaRequest(id);
    return(res.data)
  }

  useEffect(() => {
    getMarcas();
  }, []);

  const contextValue: MarcasContextValue = {
    marcas,
    setMarcas,
    getMarcas,
    createMarca,
    deleteMarca,
    getMarca,
    updateMarca
  };

  return (
    <MarcasContext.Provider value={contextValue}>
      {children}
    </MarcasContext.Provider>
  );
};