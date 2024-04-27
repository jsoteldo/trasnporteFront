import Campo from "./Campo";


class Objetos {
    _id: string;
    nombre: string;
    campos: Campo[];
    activo: string;
  
    constructor(id: string,nombre: string, campos: Campo[], activo: string) {
      this._id = id;
      this.nombre= nombre;    
      this.campos = campos;
      this.activo = activo;
    }

  
  }
  
  export default Objetos;