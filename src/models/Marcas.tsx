class Marca {
    _id: string;
    descripcion: string;
    codigo: string;
    activo: boolean;
  
    constructor(id: string,codigo: string, descripcion: string, activo: boolean) {
      this._id = id;
      this.codigo= codigo;    
      this.descripcion = descripcion;
      this.activo = activo;
    }

  
    // Métodos adicionales de la clase Producto
    // ...
  }
  
  export default Marca;