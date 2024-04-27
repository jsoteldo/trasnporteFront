import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from '@app/App';
import store from '@store/store';

import './utils/i18n';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { ProductosProvider } from './context/ProductosContext';
import { MarcasProvider } from './context/MarcasContext';
import { ObjetosProvider } from './context/ObjetosContext';
import { ComprasProvider } from './context/ComprasContext';
import { UsuariosProvider } from './context/UsuariosContext';

declare const window: any;

window.PF = {
  config: {
    mode: 'bs4',
  },
};

const container: any = document.getElementById('root');
ReactDOM.render(
  <Provider store={store}>
    <UsuariosProvider>
    <ProductosProvider>
      <MarcasProvider>
        <ObjetosProvider>
          <ComprasProvider>
            <App />
          </ComprasProvider>
        </ObjetosProvider>
      </MarcasProvider>
    </ProductosProvider>
    </UsuariosProvider>
  </Provider>,
  container
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
