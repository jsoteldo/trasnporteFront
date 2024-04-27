import React, { useState, useRef } from 'react';
import { Button, FormControl, InputLabel, Menu, Tooltip,MenuItem, Select, SelectChangeEvent, TextField, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import XLSX from 'xlsx';
import { useObjetos } from "../../context/ObjetosContext";
import { saveAs } from 'file-saver';
import Objetos from '@app/models/Objetos';
import Campo from '@app/models/Campo';
import { DataGrid } from '@mui/x-data-grid';
import DownloadIcon from '../../icons/DownloadIcon';
import AddFileIcon from '@app/icons/AddFileIcon';
import clsx from 'clsx';
import localeText from '@app/components/tabla/localeText';
import { toast } from 'react-hot-toast';

const CargaMasivaProductos = () => {
  const { objetos, getObjetos, uploadObjets } = useObjetos();
    const [file, setFile] = useState<File | null>( );
    const [insertedCount, setInsertedCount] = useState(0);
    const [errorMessage, setErrorMessage] = useState(null);
    const [recordCount, setRecordCount] = useState(0);
    const [exportType, setExportType] = useState('');
    const [objeto, setObjeto] = useState('');
    const [selectedObjeto, setSelectedObjeto] = useState<Objetos>(); // Estado para almacenar el objeto seleccionado
    const [rows, setRows] = useState<any>();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    React.useEffect(() => {
      getObjetos();
    }, []);
    
  const cleanFileData = () => {
    setFile(null);
    setRows([]);
    setRecordCount(0);
    setInsertedCount(0);
    setErrorMessage(null);
  }  

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event);
    cleanFileData();
    if(event.target.files != null) {
        const selectedFile: File = event.target.files[0];
        
    
        // Obtener el número de registros en el archivo
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const records:any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          console.log(records);
          const fileHeaders = records[0];
          const objectFields = selectedObjeto?.campos.map((campo) => campo.headerName);
          if (!objectFields || !compareArrays(fileHeaders, objectFields)) {
            toast.error('El archivo no es compatible con el objeto seleccionado.');
            return;
          }else{
            const rows = records.slice(1).map((row: any, index: number) => ({
              id: index + 1, // Agregar una propiedad id única
              codigo: row[0], // Ajusta esto según tu estructura de datos
              descripcion: row[1], // Ajusta esto según tu estructura de datos
            }));
            
            if(rows.length > 0 ){
              setFile(selectedFile);
              setRows(rows);
              setRecordCount(rows.length);
            }else{
              toast.error('El archivo no contiene registros.');
              return;
            }
            
          }
  
          
        };
        reader.readAsArrayBuffer(selectedFile);
    }
    
  };

  const compareArrays = (arr1: any[], arr2: any[]) => {
    if (arr1.length !== arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  };

  const mapRecordsToObjects = (records: any[]) => {
    return records.map((record: any, index: number) => {
      const objectData: any = {};

      // Mapear los valores de las celdas a las propiedades del objeto
      selectedObjeto?.campos.forEach((campo, columnIndex) => {
        objectData[campo.field] = record[columnIndex];
      });

      return objectData;
    });
  };

  const handleUpload = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const records = jsonData.slice(1);

        const mappedObjects = mapRecordsToObjects(records);


        uploadObjets({
          coleccion: objeto,
          rows: mappedObjects
        }); 
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleDownload = () => {
    // Descargar el archivo de registros no insertados
    const data = ['Registro 1', 'Registro 2', 'Registro 3']; // Simulación de datos de registros no insertados
    const csvContent = 'data:text/csv;charset=utf-8,' + data.join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'registros_no_insertados.csv');
    document.body.appendChild(link);
    link.click();
  };

  const getFileSize = (size: number) => {
    if (size === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleExport = () => {
    let headers = selectedObjeto?.campos || [];
    let fieldNameArray = headers.map(header => header.headerName);

    if (exportType === 'csv') {
      const content = [fieldNameArray.join(';')];
      const blob = new Blob([content.join('\n')], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, objeto+'.csv');
    } else if (exportType === 'excel') {
      const worksheet = XLSX.utils.aoa_to_sheet([fieldNameArray]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, objeto);
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, objeto+'.xlsx');
    }
  };
  
  const handleExportTypeChange = (event: SelectChangeEvent) => {
    setExportType(event.target.value as string);
  };

  const handleObjetTypeChange = (event: SelectChangeEvent) => {
    let objetSelect = event.target.value;
    setObjeto(objetSelect); 
    setSelectedObjeto(objetos.find((o) => o.nombre === objetSelect));    
  };

  const columns = selectedObjeto?.campos.map((campo) => ({
    field: campo.field,
    headerName: campo.headerName,
    width: campo.width,
  }));

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const areButtonsDisabled = exportType === '';

  const DisabledIcon = styled('span')({
    opacity: 0.5,
    // Otros estilos de icono deshabilitado
  });

  return (
    <section className="content ">
        <div className="container-fluid ">
          <div className="row mx-auto">
            <div className="col-md-6 mx-auto">
              <div className="card card-primary card-outline h-auto">
              
                <div className="card-header">
                  <h3 className="card-title">Carga Masiva de datos</h3>
                </div>
                <div className="card-body  d-flex flex-column"  >

                  <div className="p-2">
                    <FormControl  sx={{ mr: 2, minWidth: 260 }}>
                      <InputLabel id="demo-simple-select-label">Elemento a cargar</InputLabel>
                      <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-selected"
                          value={objeto}
                          label="Elemento a cargar"
                          onChange={handleObjetTypeChange}
                          >{objetos.map((o) => (
                            <MenuItem key={o._id} value={o.nombre}>
                              {o.nombre}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>

                    <FormControl  sx={{ ml: 2, minWidth: 260 }} disabled={!objeto}>
                      <InputLabel id="demo-simple-select">Tipo Archivo</InputLabel>
                      <Select
                          labelId="demo-simple-select"
                          id="demo-simple-select"
                          value={exportType}
                          label="Tipo Archivo"
                          onChange={handleExportTypeChange}
                      >
                          <MenuItem value="csv">CSV</MenuItem>
                          <MenuItem value="excel">Excel</MenuItem>
                      </Select>
                    </FormControl>    

                    <Tooltip title="Descargar Plantilla" className='ml-2'>
                      <span>
                        <IconButton onClick={handleExport} disabled={areButtonsDisabled}>
                        {areButtonsDisabled ? (
                          <DisabledIcon>
                            <DownloadIcon />
                          </DisabledIcon>
                        ) : (
                          <DownloadIcon />
                        )}
                        </IconButton>
                      </span>
                    </Tooltip>

                    <Tooltip title="Seleccionar Archivo" className='ml-2'>
                      <span>
                        <IconButton onClick={openFileDialog} disabled={areButtonsDisabled}>
                            {areButtonsDisabled ? (
                              <DisabledIcon>
                                <AddFileIcon />
                              </DisabledIcon>
                            ) : (
                              <AddFileIcon />
                            )}
                              <input
                                type="file"
                                accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                style={{ display: 'none' }}
                                ref={fileInputRef}
                                onChange={handleFileChange}
                              />
                        </IconButton>
                      </span>
                    </Tooltip>      


                   
                  </div>
                  
                    {file && (
                      <div className='d-flex  flex-column'>
                        <TextField
                          value={`Nombre del archivo: ${file.name}\nTamaño del archivo: ${getFileSize(file.size)}\nNúmero de registros: ${recordCount}`}
                          multiline
                          disabled
                          fullWidth
                          className='mb-3'
                        />
                        <div className="d-flex justify-content-end">
                          <Button variant="contained" color="primary" onClick={handleUpload} className='mb-3 p-2'  style={{ marginLeft: 'auto' }} >
                            Subir archivo
                          </Button>
                        </div>
                          
                        

                        <DataGrid  style={{ height: 250, width: '98%' }}
                      rows={rows||[]}
                      columns={columns||[]}
                      localeText={localeText}
                      />
                      </div>
                    )}

                    {insertedCount > 0 && !errorMessage && (
                      <Typography variant="body1">
                        {insertedCount} registros insertados correctamente.
                      </Typography>
                    )}

                    {errorMessage && (
                      <div>
                        <Typography variant="body1" color="error">
                          {errorMessage}
                        </Typography>
                        <Button variant="contained" onClick={handleDownload}>
                          Descargar registros no insertados
                        </Button>
                      </div>
                    )}

                    
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>       

    
  );
};

export default CargaMasivaProductos