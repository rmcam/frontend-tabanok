import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import FeatureCard from './FeatureCard'; // Asegúrate de que la ruta de importación sea correcta

// Mock genérico para cualquier LucideIcon que use forwardRef
const MockIconComponent = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => (
  <svg data-testid="mock-icon" {...props} ref={ref} />
));

vi.mock('lucide-react', () => {
  return {
    __esModule: true,
    // We don't need to importActual if we are mocking everything FeatureCard uses
    // ...vi.importActual('lucide-react'),
    // Mock createReactComponent to return our forwardRef mock component
    createReactComponent: vi.fn(() => MockIconComponent),
    // If specific icons are imported and used, mock them here using the same forwardRef pattern
    // Example: Activity: React.forwardRef((props, ref) => <svg data-testid="mock-icon-activity" {...props} ref={ref} />),
  };
});




describe('FeatureCard', () => {
  it('debería renderizar el título, la descripción y el icono con color y aria-label', () => {
    const testTitle = 'Título de Característica';
    const testDescription = 'Descripción de la característica.';
    const testAriaLabel = 'Icono de prueba';
    const testIconColor = '#FF0000';

    render(
      <FeatureCard
        title={testTitle}
        description={testDescription}
        icon={MockIconComponent} // Añadir la prop icon
        iconColor={testIconColor}
        ariaLabel={testAriaLabel}
      />
    );

    // Verificar que el título se renderiza
    expect(screen.getByText(testTitle)).toBeInTheDocument();

    // Verificar que la descripción se renderiza
    expect(screen.getByText(testDescription)).toBeInTheDocument();

    // Verificar que el icono mockeado se renderiza con el aria-label y color correctos
    const iconElement = screen.getByTestId('mock-icon');
    expect(iconElement).toBeInTheDocument();
    expect(iconElement).toHaveAttribute('aria-label', testAriaLabel);
    // Nota: El color se aplica como estilo inline en FeatureCard, no como atributo.
    expect(iconElement).toHaveStyle(`color: ${testIconColor}`);
  });

  it('debería aplicar la clase CSS proporcionada', () => {
    const testClassName = 'custom-class';
    const testTitle = 'Título con Clase';
    const testDescription = 'Descripción con Clase.';
    const testAriaLabel = 'Icono con Clase';
    const testIconColor = '#00FF00';

    render(
      <FeatureCard
        title={testTitle}
        description={testDescription}
        icon={MockIconComponent} // Añadir la prop icon
        iconColor={testIconColor}
        ariaLabel={testAriaLabel}
        className={testClassName}
      />
    );

    // Verificar que la tarjeta tiene la clase CSS
    // Buscamos el elemento con el título y luego su ancestro con la clase.
    const titleElement = screen.getByText(testTitle);
    const cardElement = titleElement.closest('.custom-class');
    expect(cardElement).toBeInTheDocument();
  });

  // Agrega más casos de prueba según la lógica de FeatureCard
});