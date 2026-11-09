import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Error boundary para manejar errores en tiempo de ejecución
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1>Algo salió mal</h1>
          <p>Hemos encontrado un error inesperado. Por favor, recarga la página.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Configuración de Axios para manejar errores globales
import axios from 'axios';

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('Error en la respuesta:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Error en la solicitud:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);