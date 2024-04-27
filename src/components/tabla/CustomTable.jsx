import React, {  useEffect,useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, FormControlLabel, Switch, ToggleButton, ToggleButtonGroup } from '@mui/material';
import * as ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import { Tooltip,IconButton } from '@mui/material';
import ExcelIcon from '../../icons/ExcelIcon';
import PdfIcon from '../../icons/PdfIcon';
import localeText from './localeText';

const CustomTable = ({ rows, columns, objeto, routeEdit, routeView, routeDelete, routeChange  }) => {
  const [pageSize, setPageSize] = useState(10);
  const [showInactive, setShowInactive] = useState("true");
  
  useEffect(() => {
    // Actualizar el estado de dataUpdated cuando los datos cambian
    setShowInactive("true");
  }, [rows]);

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
  };

  const handleShowInactiveChange = (event, newShowStatus) => {
    let newStatus = event.target.value;
    if(showInactive !== newStatus){
      setShowInactive(newStatus);
    }
  };

  const handleShowStatusChange = (event, newShowStatus) => {
    if (newShowStatus !== null) {
      setShowStatus(newShowStatus);
    }
  };
  
  const getRowId = (row) => row._id;

  const filteredRows = rows.filter(row => (showInactive === "true" && row.activo === true) || (showInactive === "false" && row.activo === false));

  const handleExportExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tabla');

    // Agregar encabezados de columna
    columns.forEach((column, index) => {
      worksheet.getCell(1, index + 1).value = column.headerName;
    });

    // Agregar filas de datos
    filteredRows.forEach((row, rowIndex) => {
      columns.forEach((column, columnIndex) => {
        worksheet.getCell(rowIndex + 2, columnIndex + 1).value = row[column.field];
      });
    });

    // Descargar archivo de Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'tabla_excel.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Tabla Exportada a PDF', 10, 10);

    filteredRows.forEach((row, index) => {
      const y = 20 + index * 10;
      columns.forEach((column, columnIndex) => {
        doc.text(column.headerName + ': ' + row[column.field], 10, y + columnIndex * 10);
      });
    });

    doc.save('tabla_pdf.pdf');
  };

  const actionsColumn = {
    field: 'actions',
    headerName: 'Acciones',
    width: 150,
    disableColumnMenu: true, // Desactivar menú de columna
    sortable: false, // Desactivar ordenar
    renderCell: (params) => (
      <div>
        {params.row.activo && (
        <i className="fas fa-edit mr-1" onClick={() => routeEdit(params.row)} style={{ cursor: 'pointer' }}></i>
        )}
        <i className="fas fa-eye mr-1" onClick={() => routeView(params.row)} style={{ cursor: 'pointer' }}></i>
        {params.row.activo && ( // Condición para mostrar el botón de eliminación si activo es true
          <i className="fas fa-trash mr-1" onClick={() => routeDelete(params.row)} style={{ cursor: 'pointer' }}></i>
        )}
      </div>
    ),
  };

  const columnsWithActions = [...columns, actionsColumn];

  return (
    <div className="mx-auto min-vh-20" style={{ height: 400, width: '98%' }}>
      
        <div className="row justify-content-between mb-4 mt-3">
          <div className="col-3">
              <button className="btn btn-primary btn-block" onClick={routeChange}>
                {objeto}
              </button>
          </div>
          <div className="col-3">
          <ToggleButtonGroup value={showInactive.toString()} exclusive onChange={handleShowInactiveChange} size="small"  color="primary">
        <ToggleButton value="true" className={`btn ${showInactive.toString() === "true" ? "btn-primary" : "btn-secondary"}`}>
          Activos
        </ToggleButton>
        <ToggleButton value="false" className={`btn ${showInactive.toString() === "false" ? "btn-primary" : "btn-secondary"}`}>
          Inactivos
        </ToggleButton>
      </ToggleButtonGroup>
          </div>
        
          <div className="col-3">
            
            <div className="float-sm-right">
              <Tooltip title="Exportar Excel">
                <IconButton onClick={handleExportExcel}>
                  <ExcelIcon />
                </IconButton>
              </Tooltip>
            
              <Tooltip title="Exportar PDF">
                <IconButton onClick={handleExportPDF}>
                  <PdfIcon />
                </IconButton> 
              </Tooltip>
            </div>
          </div>
        </div>
      <DataGrid
        rows={filteredRows}
        columns={columnsWithActions}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        rowsPerPageOptions={[5, 10, 20]}
        localeText={localeText}
        getRowId={getRowId}
        disableSelectionOnClick={true}
      />
    </div>
  );
};

export default CustomTable;
