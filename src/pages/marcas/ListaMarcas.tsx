import React, { useEffect, useState  } from 'react'
import { useMarcas } from "../../context/MarcasContext";
import { useNavigate, useLocation } from "react-router-dom";
import Marca from '@app/models/Marcas';
import toast from 'react-hot-toast';
import CustomTable from '@app/components/tabla/CustomTable';

interface ListaMarcasProps {
  // Define las funciones de enrutamiento que se pasan a CustomTable
  routeEdit: (data: any) => void;
  routeView: (data: any) => void;
  routeDelete: (data: any) => Promise<void>;

  // Otras propiedades si las tienes
}

const ListaMarcas : React.FC<ListaMarcasProps> = ({ routeEdit, routeView, routeDelete }) =>{
  const { marcas, getMarcas, deleteMarca } = useMarcas();
  let navigate = useNavigate();
  /**addd chatgpt */
  const location = useLocation();
  /**fin addd chatgpt */

  useEffect(() => {
    getMarcas();
  }, []);

  const routeChange = () => {
    let path = `/newMarcas`;
    navigate(path);
  }

   routeEdit = ( data:any) => {
    let path = `/newMarcas`;
    let id = data._id;
    navigate(path, { state: { id, viewing: false,editing: true} });
  }

   routeView = ( data:any) => {
   
    let path = `/newMarcas`;
    let id = data._id;
    navigate(path, { state: { id, viewing: true,editing: false } });
  }

   routeDelete = async( data:any) => { 
    toast((t) => (<div>
      <p>Estas seguro que quieres eliminar esta marca {data.descripcion}?</p>
      <div>
        <button  className="btn btn-primary btn-sm mx-2"onClick={async () =>{ 
          await deleteMarca(data); 
          getMarcas();
          toast.dismiss(t.id)}
          }>
            Eliminar
            </button>

        <button className="btn btn-danger btn-sm mx-2" onClick={() => toast.dismiss(t.id)}>Cancelar</button>
      </div>
    </div>),{style:{

    }})
    ;
  }

  const columns = [
    { field: 'codigo', headerName: 'Codigo', width: 150 },
    { field: 'descripcion', headerName: 'Descripcion', width: 400 }
    // ... otras columnas
  ];
  
  const rows = [
    { id: 1, name: 'John', status: 'active' },
    { id: 2, name: 'Jane', status: 'inactive' },
    // ... más filas
  ];

  return (
    <section className="content ">
        <div className="container-fluid ">
          <div className="row mx-auto">
            <div className="col-md-6 mx-auto">
              <div className="card card-primary card-outline h-auto ">
              
                <div className="card-header">
                  <h3 className="card-title">Marcas / Materia Prima</h3>
                </div>
                <div className="card-body" style={{height: 600}}>
                  
                  <CustomTable rows={marcas} columns={columns} objeto="Nueva Marca"
                  routeEdit={routeEdit}
                  routeView={routeView}
                  routeDelete={routeDelete} 
                  routeChange={routeChange}/>

                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>       
     
  )
}

export default ListaMarcas
