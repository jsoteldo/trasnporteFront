import React, { useState, useEffect } from 'react';
import DialogContentText from '@mui/material/DialogContentText';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, InputAdornment, List, ListItem, ListItemText  } from '@mui/material';
import Marca from '@app/models/Marcas';


const FindMarcas = ({ open, onClose }: { open: boolean; onClose: (item: boolean) => void })=> {
    
  
    const [searchText, setSearchText] = useState('');
    const [items, setItems] = useState<any>([]);
    const [filteredItems, setFilteredItems] = useState<Marca[]>([]);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
      // Simulación de llamada al backend para obtener la lista de objetos
      fetchItems()
        .then(data => {
          setItems(data);
          setFilteredItems(data as Marca[]);
        })
        .catch(error => {
          console.error('Error al obtener la lista de objetos:', error);
        });
    }, []);
  
    const fetchItems = () => {
      // Simulación de la llamada al backend
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const items = [
            { id: 1, name: 'Objeto 1' },
            { id: 2, name: 'Objeto 2' },
            { id: 3, name: 'Objeto 3' },
          ];
          resolve(items);
        }, 1000);
      });
    };
  
    const handleInputChange = (event: any) => {
        setSearchText(event.target.value);
        filterItems(event.target.value);
      };
    
      const filterItems = (searchText: string) => {
        const filteredItems = items.filter((item: { name: string; }) =>
          item.name.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredItems(filteredItems);
      };
  
    const handleListItemClick = (item: any) => {
      onClose(item);
    };
  
  
    return (      
      <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={() => onClose(true)}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle>Seleccione un objeto</DialogTitle>
      <DialogContent>
        <TextField
          value={searchText}
          onChange={handleInputChange}
          placeholder="Filtrar..."
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">🔍</InputAdornment>
            ),
          }}
        />
        <List>
          {filteredItems.map(item => (
            <ListItem
              key={item.id}
              button
              onClick={() => handleListItemClick(item)}
            >
              <ListItemText primary={item.nombre} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(true)}>Cancelar</Button>
      </DialogActions>
    </Dialog>
    );
  };

export default FindMarcas
