import React from 'react'; // Importar React explícitamente
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AuthModals from './AuthModals'; // Asegúrate de que la ruta de importación sea correcta
import { AuthContext, AuthContextType } from '../../auth/context/authContext'; // Importar el contexto de autenticación

// Definir tipos para las props de los componentes mockeados
type SwitchFormProps = {
  onSwitchToSignup?: () => void;
  onSwitchToForgotPassword?: () => void;
  onSwitchToSignin?: () => void;
};

// Mock de los componentes de formulario
vi.mock('../../auth/components/SigninForm', () => ({
  default: ({ onSwitchToSignup, onSwitchToForgotPassword }: SwitchFormProps) => (
    <div data-testid="signin-form">
      Signin Form
      <button onClick={onSwitchToSignup}>Switch to Signup</button>
      <button onClick={onSwitchToForgotPassword}>Switch to Forgot Password</button>
    </div>
  ),
}));

vi.mock('../../auth/components/SignupForm', () => ({
  default: ({ onSwitchToSignin }: SwitchFormProps) => (
    <div data-testid="signup-form">
      Signup Form
      <button onClick={onSwitchToSignin}>Switch to Signin</button>
    </div>
  ),
}));

vi.mock('../../auth/components/ForgotPasswordForm', () => ({
  default: ({ onSwitchToSignin }: SwitchFormProps) => (
    <div data-testid="forgot-password-form">
      Forgot Password Form
      <button onClick={onSwitchToSignin}>Switch to Signin</button>
    </div>
  ),
}));

// Mock del AuthContext
const mockAuthContextValue: AuthContextType = {
  user: null,
  loading: false,
  signingIn: false,
  signingUp: false,
  requestingPasswordReset: false,
  resettingPassword: false,
  signin: vi.fn(),
  signup: vi.fn(),
  signout: vi.fn(),
  forgotPassword: vi.fn(),
  resetPassword: vi.fn(),
  refetchUser: vi.fn(),
};

const renderWithAuthContext = (contextValue = mockAuthContextValue) => {
  return render(
    <AuthContext.Provider value={contextValue}>
      <AuthModals />
    </AuthContext.Provider>
  );
};

describe('AuthModals', () => {
  // Limpiar mocks antes de cada test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('no debería renderizar ningún modal inicialmente', () => {
    renderWithAuthContext();
    expect(screen.queryByTestId('signin-form')).not.toBeInTheDocument();
    expect(screen.queryByTestId('signup-form')).not.toBeInTheDocument();
    expect(screen.queryByTestId('forgot-password-form')).not.toBeInTheDocument();
  });

  it('debería abrir el modal de signin cuando se llama a setOpenModal con "signin"', () => {
    const { rerender } = renderWithAuthContext();
    // Simular la llamada a setOpenModal('signin') - esto requiere acceder al estado interno o mockear el hook/contexto que lo expone
    // Dado que AuthModals maneja su propio estado local, necesitamos simular la interacción que cambiaría ese estado.
    // En una aplicación real, esto probablemente se activaría por un botón en otro componente.
    // Para este test, podemos modificar el componente AuthModals para exponer setOpenModal o testear la interacción completa.
    // Una forma más sencilla para testear el estado interno es mockear el hook o contexto que maneja el estado del modal si existiera uno global.
    // Como no parece haber un contexto global para el estado del modal, mockearemos el componente para exponer setOpenModal.
    // Sin embargo, la estructura actual de AuthModals no facilita esto directamente.
    // Un enfoque alternativo es testear la interacción completa si AuthModals se activa por props o contexto.
    // Revisando AuthModals.tsx, parece que el estado del modal se maneja internamente con useState.
    // Para testear esto, necesitamos simular la interacción del usuario que abre el modal.
    // Si AuthModals se renderiza condicionalmente o recibe props para controlar su visibilidad, testearíamos esas props.
    // Dado que AuthModals parece ser un componente que siempre se renderiza y maneja su estado internamente,
    // la forma más directa de testear los diferentes estados del modal es mockear useState o refactorizar AuthModals
    // para recibir el estado y el setter como props.
    // Por ahora, asumiré que hay un mecanismo externo (no visible en el código actual) que llama a setOpenModal.
    // Mockearé useState para controlar el estado del modal.

    const mockSetOpenModal = vi.fn();
    vi.spyOn(React, 'useState').mockReturnValue(['signin', mockSetOpenModal]);

    rerender(
       <AuthContext.Provider value={mockAuthContextValue}>
         <AuthModals />
       </AuthContext.Provider>
    );

    expect(screen.getByTestId('signin-form')).toBeInTheDocument();
    expect(screen.queryByTestId('signup-form')).not.toBeInTheDocument();
    expect(screen.queryByTestId('forgot-password-form')).not.toBeInTheDocument();

    vi.spyOn(React, 'useState').mockRestore(); // Restaurar useState
  });

   it('debería abrir el modal de signup cuando se llama a setOpenModal con "signup"', () => {
    const { rerender } = renderWithAuthContext();

    const mockSetOpenModal = vi.fn();
    vi.spyOn(React, 'useState').mockReturnValue(['signup', mockSetOpenModal]);

    rerender(
       <AuthContext.Provider value={mockAuthContextValue}>
         <AuthModals />
       </AuthContext.Provider>
    );

    expect(screen.queryByTestId('signin-form')).not.toBeInTheDocument();
    expect(screen.getByTestId('signup-form')).toBeInTheDocument();
    expect(screen.queryByTestId('forgot-password-form')).not.toBeInTheDocument();

    vi.spyOn(React, 'useState').mockRestore(); // Restaurar useState
  });

   it('debería abrir el modal de forgot password cuando se llama a setOpenModal con "forgotPassword"', () => {
    const { rerender } = renderWithAuthContext();

    const mockSetOpenModal = vi.fn();
    vi.spyOn(React, 'useState').mockReturnValue(['forgotPassword', mockSetOpenModal]);

    rerender(
       <AuthContext.Provider value={mockAuthContextValue}>
         <AuthModals />
       </AuthContext.Provider>
    );

    expect(screen.queryByTestId('signin-form')).not.toBeInTheDocument();
    expect(screen.queryByTestId('signup-form')).not.toBeInTheDocument();
    expect(screen.getByTestId('forgot-password-form')).toBeInTheDocument();

    vi.spyOn(React, 'useState').mockRestore(); // Restaurar useState
  });

  it('debería cerrar el modal cuando se llama a setOpenModal con null', () => {
    const { rerender } = renderWithAuthContext();

    const mockSetOpenModal = vi.fn();
    vi.spyOn(React, 'useState').mockReturnValue(['signin', mockSetOpenModal]); // Iniciar con modal abierto

    rerender(
       <AuthContext.Provider value={mockAuthContextValue}>
         <AuthModals />
       </AuthContext.Provider>
    );

    expect(screen.getByTestId('signin-form')).toBeInTheDocument();

    vi.spyOn(React, 'useState').mockReturnValue([null, mockSetOpenModal]); // Simular cierre

     rerender(
       <AuthContext.Provider value={mockAuthContextValue}>
         <AuthModals />
       </AuthContext.Provider>
    );

    expect(screen.queryByTestId('signin-form')).not.toBeInTheDocument();
    expect(screen.queryByTestId('signup-form')).not.toBeInTheDocument();
    expect(screen.queryByTestId('forgot-password-form')).not.toBeInTheDocument();

    vi.spyOn(React, 'useState').mockRestore(); // Restaurar useState
  });

  it('debería cambiar de formulario al hacer clic en los botones de switch', () => {
    const { rerender } = renderWithAuthContext();

    const mockSetOpenModal = vi.fn();
    vi.spyOn(React, 'useState').mockReturnValue(['signin', mockSetOpenModal]); // Iniciar con signin

    rerender(
       <AuthContext.Provider value={mockAuthContextValue}>
         <AuthModals />
       </AuthContext.Provider>
    );

    // De signin a signup
    const switchToSignupButton = screen.getByText('Switch to Signup');
    fireEvent.click(switchToSignupButton);
    expect(mockSetOpenModal).toHaveBeenCalledWith('signup');

    // De signin a forgot password
    const switchToForgotPasswordButton = screen.getByText('Switch to Forgot Password');
    fireEvent.click(switchToForgotPasswordButton);
    expect(mockSetOpenModal).toHaveBeenCalledWith('forgotPassword');

    // Simular cambio a signup para testear switch a signin
    vi.spyOn(React, 'useState').mockReturnValue(['signup', mockSetOpenModal]);
     rerender(
       <AuthContext.Provider value={mockAuthContextValue}>
         <AuthModals />
       </AuthContext.Provider>
    );
    const switchToSigninButtonFromSignup = screen.getByText('Switch to Signin');
    fireEvent.click(switchToSigninButtonFromSignup);
    expect(mockSetOpenModal).toHaveBeenCalledWith('signin');

     // Simular cambio a forgot password para testear switch a signin
    vi.spyOn(React, 'useState').mockReturnValue(['forgotPassword', mockSetOpenModal]);
     rerender(
       <AuthContext.Provider value={mockAuthContextValue}>
         <AuthModals />
       </AuthContext.Provider>
    );
    const switchToSigninButtonFromForgot = screen.getByText('Switch to Signin');
    fireEvent.click(switchToSigninButtonFromForgot);
    expect(mockSetOpenModal).toHaveBeenCalledWith('signin');


    vi.spyOn(React, 'useState').mockRestore(); // Restaurar useState
  });

  // Agrega más casos de prueba según la lógica de AuthModals
  // Por ejemplo, testear los títulos y descripciones de los modales
});