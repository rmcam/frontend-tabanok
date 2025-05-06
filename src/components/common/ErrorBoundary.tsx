import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Actualiza el estado para que el próximo renderizado muestre la interfaz de respaldo.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Puedes registrar el error en un servicio de reporte de errores
    console.error('ErrorBoundary caught an error: ', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Puedes renderizar cualquier interfaz de respaldo personalizada
      return (
        <div className="text-red-500">
          Ocurrió un error. Por favor, inténtalo de nuevo más tarde.
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
