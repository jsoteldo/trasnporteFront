import { createContext, useContext, useState, useEffect } from 'react';
import { getComprasRequest, createCompraRequest, deleteCompraRequest, getCompraRequest, updateCompraRequest } from '../api/ComprasApi';
import Compra from '@app/models/Compra';

interface ComprasContextValue {
  compras: Compra[];
  setCompras: React.Dispatch<React.SetStateAction<Compra[]>>;
  getCompras: () => Promise<void>;
  createCompra: (compra: Compra) => Promise<void>;
  deleteCompra: (compra:Compra) => Promise<void>;
  getCompra: (id:any) => Promise<Compra>;
  updateCompra:(compra:Compra) => Promise<void>;
}

const ComprasContext = createContext<ComprasContextValue | undefined>(undefined);

export const useCompras = (): ComprasContextValue => {
  const context = useContext(ComprasContext);
  if (!context) {
    throw new Error('useCompras debe ser utilizado dentro de un ComprasProvider');
  }
  return context;
};

export const ComprasProvider: React.FC = ({ children }:any) => {
  const [compras, setCompras] = useState<Compra[]>([]);

  const getCompras = async () => {
    try {
      const res = await getComprasRequest();
      setCompras(res.data);
    } catch (error) {
      console.error('Error al obtener los compra:', error);
    }
  };

  const createCompra = async (compra: Compra) => {
    try {
      console.log(compra);
      const res = await createCompraRequest(compra);
      setCompras([...compras, res.data]);
    } catch (error) {
      console.error('Error al crear el compra:', error);
    }
  };

  const deleteCompra = async (compra: Compra) => {
    try {
      const res = await deleteCompraRequest(compra._id,compra);
      if(res.status === 204){
        setCompras(compras.filter((m) => m._id !== compra._id));
      }
    } catch (error) {
      console.error('Error al Eliminar la compra:', error);
    }
  };

  const updateCompra = async (compra: Compra) => {
    try {
      console.log("compra a actualizar: "+compra);
      const res = await updateCompraRequest(compra._id, compra);
      if(res.status === 204){
        setCompras(compras.map((m) => (m._id !== compra._id ? res.data : m)));
      }
    } catch (error) {
      console.error('Error al Eliminar la compra:', error);
    }
  };

  const getCompra = async (id:any) => {
    const res = await getCompraRequest(id);
    return(res.data)
  }

  useEffect(() => {
    getCompras();
  }, []);

  const contextValue: ComprasContextValue = {
    compras,
    setCompras,
    getCompras,
    createCompra,
    deleteCompra,
    getCompra,
    updateCompra
  };

  return (
    <ComprasContext.Provider value={contextValue}>
      {children}
    </ComprasContext.Provider>
  );
};