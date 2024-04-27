import ProductosCompras from "./ProductosCompras";

class Compra {
    _id: string;
    comercio: string;
    productos: ProductosCompras[];
    totalGeneral: number;
    formaDePago: 'divisas' | 'monedaLocal' | 'combinado';
    montoLocal?: string;
    montoDivisas?: string;
    
    constructor(id: string, comercio: string,
         productos:ProductosCompras[],
         totalGeneral: number,
         formaDePago: 'divisas' | 'monedaLocal' | 'combinado',
        montoLocal?: string,
        montoDivisas?: string) {
      this._id = id;
      this.comercio = comercio;
      this.productos = productos;
      this.totalGeneral = totalGeneral;
      this.formaDePago = formaDePago;
      this.montoLocal = montoLocal;
      this.montoDivisas = montoDivisas;
    }

  
  }
  
  export default Compra;