class Producto {
    _id:string;
    codigo: number;
    nombre: string;
    precio: number;
  
    constructor(_id:string,
        codigo: number,nombre: string, precio: number) {
      this._id=_id;
      this.codigo= codigo;      
      this.nombre = nombre;
      this.precio = precio;
    }
    
    static getHeader(): string[] {
        return ['Codigo','Nombre', 'Precio'];
      }
    // Métodos adicionales de la clase Producto
    // ...
  }
  
  export default Producto;