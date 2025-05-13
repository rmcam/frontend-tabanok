import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CustomCard from './CustomCard'; // Asegúrate de que la ruta de importación sea correcta

describe('CustomCard', () => {
  it('debería renderizar el título, la descripción y los hijos', () => {
    const testTitle = 'Título de Prueba';
    const testDescription = 'Descripción de Prueba';
    const testChildren = <div>Contenido de Prueba</div>;

    render(
      <CustomCard title={testTitle} description={testDescription}>
        {testChildren}
      </CustomCard>
    );

    // Verificar que el título se renderiza
    expect(screen.getByText(testTitle)).toBeInTheDocument();

    // Verificar que la descripción se renderiza
    expect(screen.getByText(testDescription)).toBeInTheDocument();

    // Verificar que los hijos se renderizan
    expect(screen.getByText('Contenido de Prueba')).toBeInTheDocument();
  });

  it('debería renderizar solo el título y los hijos si la descripción es nula o indefinida', () => {
    const testTitle = 'Título sin Descripción';
    const testChildren = <div>Otro Contenido</div>;

    render(
      <CustomCard title={testTitle} description={undefined}>
        {testChildren}
      </CustomCard>
    );

    expect(screen.getByText(testTitle)).toBeInTheDocument();
    expect(screen.getByText('Otro Contenido')).toBeInTheDocument();
    expect(screen.queryByText('Descripción sin Descripción')).not.toBeInTheDocument(); // Asegurarse de que no hay descripción
  });

  // Agrega más casos de prueba según la lógica de CustomCard
});