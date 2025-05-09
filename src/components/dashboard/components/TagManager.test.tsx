import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TagManager from './TagManager';
import { describe, it, expect, vi } from 'vitest';
import api from '@/lib/api';
import { toast } from 'sonner'; // Keep import for typing

// Mock the sonner toast before the describe block
vi.mock('sonner', () => {
  // Define spies inside the mock factory
  const toastSuccessSpy = vi.fn();
  const toastErrorSpy = vi.fn(); // Removed toastWarningSpy
  return {
    toast: {
      success: toastSuccessSpy,
      error: toastErrorSpy,
    },
  };
});

// Define spies outside the mock factory for use in tests
const toastSuccessSpy = vi.mocked(toast.success);
const toastErrorSpy = vi.mocked(toast.error); // Removed toastWarningSpy

// Mock the api module
vi.mock('@/lib/api');

describe('TagManager', () => {
  // Clear mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component', () => {
    render(<TagManager />);
    // Add assertions here to check if the component renders correctly
    expect(screen.getByText('Gestión de Etiquetas')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Crear Nueva Etiqueta' })).toBeInTheDocument();
  });

  it('fetches and displays tags', async () => {
    const mockTags = [
      { id: 1, name: 'Tag 1' },
      { id: 2, name: 'Tag 2' },
    ];
    vi.mocked(api.get).mockResolvedValue(mockTags);

    render(<TagManager />);

    await waitFor(() => {
      expect(screen.getByText('Etiquetas Existentes')).toBeInTheDocument();
      expect(screen.getByText('Tag 1')).toBeInTheDocument();
      expect(screen.getByText('Tag 2')).toBeInTheDocument();
    });
  });

  it('creates a new tag', async () => {
    vi.mocked(api.post).mockResolvedValue({ id: 3, name: 'New Tag' });
    // Removed vi.mock('sonner', ...) from here
    render(<TagManager />);

    // Click the button to show the form
    await userEvent.click(screen.getByRole('button', { name: 'Crear Nueva Etiqueta' }));

    // Wait for the form to appear
    await screen.findByText('Crear Nueva Etiqueta');

    // Type the new tag name
    screen.getByLabelText('Nombre').focus();
    await userEvent.type(screen.getByLabelText('Nombre'), 'New Tag');

    // Click the save button
    screen.getByRole('button', { name: 'Guardar' }).click();

    // Assert that api.post was called with the correct data
    await waitFor(() => {
      expect(vi.mocked(api.post)).toHaveBeenCalledWith('/tags', { name: 'New Tag' });
      expect(toastSuccessSpy).toHaveBeenCalledWith('Etiqueta creada exitosamente.'); // Use spy variable
    });
  });

  it('updates an existing tag', async () => {
    const initialTags = [
      { id: 1, name: 'Tag 1' },
      { id: 2, name: 'Tag 2' },
    ];
    vi.mocked(api.get).mockResolvedValue(initialTags);
    vi.mocked(api.put).mockResolvedValue({ id: 1, name: 'Updated Tag' });
    // Removed vi.mock('sonner', ...) from here
    render(<TagManager />);

    // Wait for tags to load
    await waitFor(() => {
      expect(screen.getByText('Tag 1')).toBeInTheDocument();
    });

    // Find the row for 'Tag 1' and click the edit button within that row
    const tag1Row = screen.getByRole('row', { name: /Tag 1/i });
    await userEvent.click(within(tag1Row).getByRole('button', { name: 'Editar' }));

    // Type the updated tag name
    screen.getByLabelText('Nombre').focus();
    await userEvent.clear(screen.getByLabelText('Nombre'));
    await userEvent.type(screen.getByLabelText('Nombre'), 'Updated Tag');

    // Click the save button
    screen.getByRole('button', { name: 'Guardar' }).click();

    // Assert that api.put was called with the correct data
    await waitFor(() => {
      expect(vi.mocked(api.put)).toHaveBeenCalledWith('/tags/1', { name: 'Updated Tag' });
      expect(toastSuccessSpy).toHaveBeenCalledWith('Etiqueta actualizada exitosamente.'); // Use spy variable
    });
  });

  it('deletes an existing tag', async () => {
    const initialTags = [
      { id: 1, name: 'Tag 1' },
      { id: 2, name: 'Tag 2' },
    ];
    vi.mocked(api.get).mockResolvedValue(initialTags);
    vi.mocked(api.delete).mockResolvedValue(undefined);
    // Removed vi.mock('sonner', ...) from here
    render(<TagManager />);

    // Wait for tags to load
    await waitFor(() => {
      expect(screen.getByText('Tag 1')).toBeInTheDocument();
    });

    // Click the delete button for Tag 1
    screen.getByRole('button', { name: 'Eliminar' }).click();

    // Assert that api.delete was called with the correct ID
    await waitFor(() => {
      expect(vi.mocked(api.delete)).toHaveBeenCalledWith('/tags/1');
      expect(toastSuccessSpy).toHaveBeenCalledWith('Etiqueta eliminada exitosamente.'); // Use spy variable
      // Assert that the deleted tag is removed from the list
      expect(screen.queryByText('Tag 1')).not.toBeInTheDocument();
      expect(screen.getByText('Tag 2')).toBeInTheDocument();
    });
  });

  it('shows error toast on api.post failure during tag creation', async () => {
    const errorMessage = 'Failed to create tag';
    vi.mocked(api.post).mockRejectedValue(new Error(errorMessage));

    render(<TagManager />);
    const user = userEvent.setup();

    // Click the button to show the form
    await user.click(screen.getByRole('button', { name: 'Crear Nueva Etiqueta' }));

    // Type the new tag name
    await user.type(screen.getByLabelText('Nombre'), 'New Tag');

    // Click the save button
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    // Assert that api.post was called
    await waitFor(() => {
      expect(vi.mocked(api.post)).toHaveBeenCalledWith('/tags', { name: 'New Tag' });
    });

    // Assert that error toast was shown
    await waitFor(() => {
      expect(toastErrorSpy).toHaveBeenCalledWith('Error al crear la etiqueta: Failed to create tag'); // Use spy variable and check full error message
    });

    // Assert that form fields are not cleared on error
    expect(screen.getByLabelText('Nombre')).toHaveValue('New Tag');
  });
});
