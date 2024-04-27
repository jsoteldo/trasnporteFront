class Campo {
  field: string;
  headerName: string;
  width: number;

  constructor( field: string, headerName: string, width: number) {
    this.field = field;
    this.headerName = headerName;
    this.width = width;
  }
}
export default Campo;