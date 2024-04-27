import { createContext, useContext, useState, useEffect } from 'react';
import { getProductosRequest, createProductoRequest } from '../api/ProductosApi';
import Producto from '@app/models/Productos';

interface ProductosContextValue {
  productos: Producto[];
  setProductos: React.Dispatch<React.SetStateAction<Producto[]>>;
  getProductos: () => Promise<void>;
  createProducto: (producto: Producto) => Promise<void>;
}

const ProductosContext = createContext<ProductosContextValue | undefined>(undefined);

export const useProductos = (): ProductosContextValue => {
  const context = useContext(ProductosContext);
  if (!context) {
    throw new Error('useProductos debe ser utilizado dentro de un ProductosProvider');
  }
  return context;
};

export const ProductosProvider: React.FC = ({ children }:any) => {
  const [productos, setProductos] = useState<Producto[]>([]);

  const getProductos = async () => {
    try {
      const res = await getProductosRequest();
      setProductos(res.data);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  const createProducto = async (producto: Producto) => {
    try {
      const res = await createProductoRequest(producto);
      setProductos([...productos, res.data]);
    } catch (error) {
      console.error('Error al crear el producto:', error);
    }
  };

  useEffect(() => {
    getProductos();
  }, []);

  const contextValue: ProductosContextValue = {
    productos,
    setProductos,
    getProductos,
    createProducto,
  };

  return (
    <ProductosContext.Provider value={contextValue}>
      {children}
    </ProductosContext.Provider>
  );
};