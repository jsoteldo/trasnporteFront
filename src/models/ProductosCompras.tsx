class Producto {
    _id:string;
    nombre: string;
    cantidad: number;
    marca: string;
    presentacion: 'litros' | 'mililitros' | 'gramos' | 'kilogramos';
    precioUnitario?: number;
    precioTotal?: number;

    constructor(_id:string,
      cantidad: number,nombre: string, marca: string,presentacion: 'litros' | 'mililitros' | 'gramos' | 'kilogramos',
       precioUnitario:number, precioTotal:number) {
      this._id=_id;
      this.cantidad= cantidad;      
      this.nombre = nombre;
      this.marca = marca;
      this.presentacion = presentacion;
      this.precioUnitario = precioUnitario;
      this.precioTotal =  cantidad * precioUnitario ;
    }
    
    
    // Métodos adicionales de la clase Producto
    // ...
  }
  
  export default Producto;