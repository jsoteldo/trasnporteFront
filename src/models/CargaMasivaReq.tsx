class CargaMasivaReq {
    coleccion: string;
    rows: any[];
  
    constructor(coleccion: string, rows: any[]) {
      this.coleccion = coleccion;
      this.rows= rows;  
    }

  
  }
  
  export default CargaMasivaReq;