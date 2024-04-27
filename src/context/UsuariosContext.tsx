import { createContext, useContext, useState, useEffect } from 'react';
import { getUsuariosRequest, createUsuarioRequest, deleteUsuarioRequest, getUsuarioRequest, updateUsuarioRequest, getLoginRequest } from '../api/UsuariosApi';
import Usuario from '@app/models/Usuarios';

interface UsuariosContextValue {
  usuarios: Usuario[];
  setUsuarios: React.Dispatch<React.SetStateAction<Usuario[]>>;
  getUsuarios: () => Promise<void>;
  createUsuario: (usuario: Usuario) => Promise<void>;
  deleteUsuario: (usuario: Usuario) => Promise<void>;
  getUsuario: (id:any) => Promise<Usuario>;
  updateUsuario:(usuario: Usuario) => Promise<void>;
  loginUsuario:(usuario: Usuario) => Promise<any>;
}

const UsuariosContext = createContext<UsuariosContextValue | undefined>(undefined);

export const useUsuarios = (): UsuariosContextValue => {
  const context = useContext(UsuariosContext);
  if (!context) {
    throw new Error('useUsuarios debe ser utilizado dentro de un UsuariosProvider');
  }
  return context;
};

export const UsuariosProvider: React.FC = ({ children }:any) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const getUsuarios = async () => {
    try {
      const res = await getUsuariosRequest();
      setUsuarios(res.data);
    } catch (error) {
      console.error('Error al obtener los Usuarios:', error);
    }
  };

  const createUsuario = async (usuario: Usuario) => {
    try {
      console.log(usuario);
      const res = await createUsuarioRequest(usuario);
      setUsuarios([...usuarios, res.data]);
    } catch (error) {
      console.error('Error al crear el Usuario:', error);
    }
  };

  const deleteUsuario = async (usuario: Usuario) => {
    try {
      const res = await deleteUsuarioRequest(usuario._id,usuario);
      if(res.status === 204){
        setUsuarios(usuario.filter((m) => m._id !== usuario._id));
      }
    } catch (error) {
      console.error('Error al Eliminar el Usuario:', error);
    }
  };

  const updateUsuario = async (usuario: Usuario) => {
    try {
      console.log("Usuario a actualizar: "+usuario);
      const res = await updateUsuarioRequest(usuario._id, usuario);
      if(res.status === 204){
        setUsuarios(usuario.map((m) => (m._id !== usuario._id ? res.data : m)));
      }
    } catch (error) {
      console.error('Error al Eliminar el Usuario:', error);
    }
  };
  
  const loginUsuario = async (usuario: Usuario) : Promise<any> =>  {
    return new Promise(async (res, rej) => {
      try {
        const response = await getLoginRequest(usuario);
        if(response.status === 200){
          setUsuarios(response.data);
          localStorage.setItem(
            'authentication',
            JSON.stringify( response.data.token)
          );
          return res({ profile: { email: usuario.email } });
        } else {
          return rej({ message: 'Credenciales son invalidos!' });
        }
      } catch (error) {
        if(error?.response.status === 400){
          rej({ message: error?.response.data.msg });
        }else{
          rej({ message: 'Se ha producido un Error Inesperado!' });
        }
       
      }
    });
  };

  const getUsuario = async (id:any) => {
    const res = await getUsuarioRequest(id);
    return(res.data)
  }

  useEffect(() => {
    getUsuarios();
  }, []);

  const contextValue: UsuariosContextValue = {
    usuarios,
    setUsuarios,
    getUsuarios,
    createUsuario,
    deleteUsuario,
    getUsuario,
    updateUsuario,
    loginUsuario
  };

  return (
    <UsuariosContext.Provider value={contextValue}>
      {children}
    </UsuariosContext.Provider>
  );
};