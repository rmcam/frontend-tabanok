import { Component, type ErrorInfo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next'; // Importar useTranslation

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode; // Prop opcional para una UI de fallback personalizada
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Actualiza el estado para que el siguiente renderizado muestre la UI de fallback.
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // También puedes registrar el error en un servicio de informes de errores
    console.error("Uncaught error in ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      // Puedes renderizar cualquier UI de fallback personalizada
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Usar useTranslation dentro de un componente funcional para acceder a t
      const FallbackComponent = () => {
        const { t } = useTranslation();
        return (
          <div className="flex flex-col items-center justify-center min-h-[300px] p-4 bg-red-100 text-red-800 border border-red-400 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-2">{t("¡Algo salió mal!")}</h2>
            <p className="text-lg text-center mb-4">
              {t("Lo sentimos, ha ocurrido un error inesperado. Por favor, inténtalo de nuevo más tarde.")}
            </p>
            {/* Opcional: mostrar detalles del error en desarrollo */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 p-2 bg-red-50 border border-red-300 rounded text-sm text-left w-full max-w-md overflow-auto">
                <summary>{t("Detalles del error")}</summary>
                <pre className="whitespace-pre-wrap break-words">
                  {this.state.error.toString()}
                  <br />
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        );
      };
      return <FallbackComponent />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
