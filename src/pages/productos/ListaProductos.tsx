import React, { useEffect } from 'react'
import { useProductos } from "../../context/ProductosContext";
import { useNavigate } from "react-router-dom";
import Producto from '@app/models/Productos';

const ListaProductos = () => {
  const { productos, getProductos } = useProductos();
  let navigate = useNavigate();

  useEffect(() => {
    getProductos();
  }, []);

  const routeChange = () => {
    let path = `/new`;
    navigate(path);
  }
  
  return (
     <div className="card">
            <div className="card-header">
              <h3 className="card-title">Productos / Materia Prima</h3>
            </div>
            {/* /.card-header */}
            <div className="card-body">
              <div className="col-2">
                  {/*type="submit" */}
                  <button 
                  className="btn btn-primary btn-block" onClick={routeChange}>
                    Nuevo Producto
                  </button>
                </div>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th style={{width: 10}}>#</th>
                    <th>Materia Prima</th>
                    <th style={{width: 60}}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map(producto=> (
                    <tr key={producto._id}>
                      <td>{producto.codigo}</td>
                      <td>{producto.nombre}</td>
                      <td>
                        <i className="fas fa-chart-pie mr-1"></i>
                        <i className="fas fa-chart-pie mr-1"></i>
                        <i className="fas fa-chart-pie mr-1"></i>
                      </td>
                      <td><span className="badge bg-danger">55%</span></td>
                    </tr>
                  ))}
                  <tr>
                    <td>1.</td>
                    <td>Update software</td>
                    <td>
                      <div className="progress progress-xs">
                        <div className="progress-bar progress-bar-danger" style={{width: '55%'}} />
                      </div>
                    </td>
                    <td><span className="badge bg-danger">55%</span></td>
                  </tr>
                  <tr>
                    <td>2.</td>
                    <td>Clean database</td>
                    <td>
                      <div className="progress progress-xs">
                        <div className="progress-bar bg-warning" style={{width: '70%'}} />
                      </div>
                    </td>
                    <td><span className="badge bg-warning">70%</span></td>
                  </tr>
                  <tr>
                    <td>3.</td>
                    <td>Cron job running</td>
                    <td>
                      <div className="progress progress-xs progress-striped active">
                        <div className="progress-bar bg-primary" style={{width: '30%'}} />
                      </div>
                    </td>
                    <td><span className="badge bg-primary">30%</span></td>
                  </tr>
                  <tr>
                    <td>4.</td>
                    <td>Fix and squish bugs</td>
                    <td>
                      <div className="progress progress-xs progress-striped active">
                        <div className="progress-bar bg-success" style={{width: '90%'}} />
                      </div>
                    </td>
                    <td><span className="badge bg-success">90%</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* /.card-body */}
            <div className="card-footer clearfix">
              <ul className="pagination pagination-sm m-0 float-right">
                <li className="page-item"><a className="page-link" href="#">«</a></li>
                <li className="page-item"><a className="page-link" href="#">1</a></li>
                <li className="page-item"><a className="page-link" href="#">2</a></li>
                <li className="page-item"><a className="page-link" href="#">3</a></li>
                <li className="page-item"><a className="page-link" href="#">»</a></li>
              </ul>
            </div>
          </div>
  )
}

export default ListaProductos
