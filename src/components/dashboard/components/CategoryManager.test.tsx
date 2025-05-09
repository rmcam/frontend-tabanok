import React from 'react';
import { render, screen, waitFor, act, within } from '@testing-library/react'; // Import within
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import CategoryManager from './CategoryManager';
import api from '@/lib/api';

// Mock the api module
vi.mock('@/lib/api');
// Mock the sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

describe('CategoryManager', () => {
  const mockCategories = [
    { id: 1, name: 'Category 1' },
    { id: 2, name: 'Category 2' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementation for api.get
    vi.mocked(api.get).mockResolvedValue(mockCategories);
    // Default mock implementations for other api methods
    vi.mocked(api.post).mockResolvedValue(undefined); // Corrected
    vi.mocked(api.put).mockResolvedValue(undefined); // Corrected
    vi.mocked(api.delete).mockResolvedValue(undefined); // Corrected
  });

  it('renders the component and fetches categories', async () => {
    render(<CategoryManager />);

    expect(screen.getByText('Gestión de Categorías')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Crear Nueva Categoría' })).toBeInTheDocument();
    expect(screen.getByText('Categorías Existentes')).toBeInTheDocument();
    expect(screen.getByText('Cargando categorías...')).toBeInTheDocument();

    // Wait for categories to load and display
    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
      expect(screen.getByText('Category 2')).toBeInTheDocument();
    });

    expect(api.get).toHaveBeenCalledWith('/categories');
  });

  it('shows the form when "Crear Nueva Categoría" button is clicked', async () => {
    render(<CategoryManager />);
    const user = userEvent.setup();

    const createButton = screen.getByRole('button', { name: 'Crear Nueva Categoría' });

    await act(async () => {
      await user.click(createButton);
    });

    // Wait for the form to appear
    await waitFor(() => {
      expect(screen.getByText('Crear Nueva Categoría')).toBeInTheDocument(); // Form title
      expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    });
  });

  it('hides the form when "Cancelar" button is clicked', async () => {
    render(<CategoryManager />);
    const user = userEvent.setup();

    const createButton = screen.getByRole('button', { name: 'Crear Nueva Categoría' });

    await act(async () => {
      await user.click(createButton);
    });

    // Wait for the form to appear
    await waitFor(() => {
      expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument(); // Form is visible
    });


    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });

    await act(async () => {
      await user.click(cancelButton);
    });

    await waitFor(() => {
      expect(screen.queryByLabelText(/Nombre/i)).not.toBeInTheDocument(); // Form is hidden
    });
  });

  it('shows validation error if name is empty on save', async () => {
    render(<CategoryManager />);
    const user = userEvent.setup();

    const createButton = screen.getByRole('button', { name: 'Crear Nueva Categoría' });

    await act(async () => {
      await user.click(createButton);
    });

    // Wait for the form and save button to appear
    const saveButton = await screen.findByRole('button', { name: 'Guardar' });

    await act(async () => {
      await user.click(saveButton);
    });

    // Wait for the validation error message to appear
    await waitFor(() => {
      expect(screen.getByText('El nombre de la categoría es obligatorio.')).toBeInTheDocument();
    });

    expect(api.post).not.toHaveBeenCalled();
  });

  it('creates a new category', async () => {
    render(<CategoryManager />);
    const user = userEvent.setup();

    // Mock api.get to return the updated list after creation
    vi.mocked(api.get).mockResolvedValueOnce(mockCategories).mockResolvedValueOnce([...mockCategories, { id: 3, name: 'New Category' }]);

    const createButton = screen.getByRole('button', { name: 'Crear Nueva Categoría' });

    await act(async () => {
      await user.click(createButton);
    });

    // Wait for the form and inputs to appear
    const nameInput = await screen.findByLabelText(/Nombre/i);
    const saveButton = screen.getByRole('button', { name: 'Guardar' });

    await act(async () => {
      await user.type(nameInput, 'New Category');
      await user.click(saveButton);
    });

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/categories', { name: 'New Category' });
    });

    // Wait for the success toast message to appear
    await waitFor(() => {
      expect(screen.getByText('Categoría creada exitosamente.')).toBeInTheDocument();
    });


    // Wait for the new category to appear in the list
    await waitFor(() => {
      expect(screen.getByText('New Category')).toBeInTheDocument();
    });
  });

  it('updates an existing category', async () => {
    render(<CategoryManager />);
    const user = userEvent.setup();

    // Wait for categories to load
    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
    });

    // Find the row for Category 1
    const category1Row = screen.getByText('Category 1').closest('tr');
    // Use within to find the Edit button within that row
    const editButton = within(category1Row as HTMLElement).getByRole('button', { name: 'Editar' });

    await act(async () => {
      await user.click(editButton);
    });

    // Wait for the form to appear with the category data
    await waitFor(() => {
      expect(screen.getByText('Editar Categoría')).toBeInTheDocument();
    });
    const nameInput = screen.getByLabelText(/Nombre/i);
    expect(nameInput).toHaveValue('Category 1');

    // Type the updated name and save
    await act(async () => {
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Category 1');
    });

    // Mock api.get to return the updated list after update
    vi.mocked(api.get).mockResolvedValueOnce(mockCategories).mockResolvedValueOnce([{ id: 1, name: 'Updated Category 1' }, mockCategories[1]]);

    const saveButton = screen.getByRole('button', { name: 'Guardar' });

    await act(async () => {
      await user.click(saveButton);
    });

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/categories/1', { name: 'Updated Category 1' });
    });

    // Wait for the success toast message to appear
    await waitFor(() => {
      expect(screen.getByText('Categoría actualizada exitosamente.')).toBeInTheDocument();
    });


    // Wait for the updated category name to appear in the list
    await waitFor(() => {
      expect(screen.getByText('Updated Category 1')).toBeInTheDocument();
    });
  });

  it('deletes an existing category', async () => {
    render(<CategoryManager />);
    const user = userEvent.setup();

    // Wait for categories to load
    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
    });

    // Find the row for Category 1
    const category1Row = screen.getByText('Category 1').closest('tr');
    // Use within to find the Delete button within that row
    const deleteButton = within(category1Row as HTMLElement).getByRole('button', { name: 'Eliminar' });

    // Mock api.delete to resolve successfully
    vi.mocked(api.get).mockResolvedValueOnce(mockCategories).mockResolvedValueOnce([mockCategories[1]]);
    vi.mocked(api.delete).mockResolvedValueOnce(undefined);


    await act(async () => {
      await user.click(deleteButton);
    });

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('/categories/1');
    });

    // Wait for the success toast message to appear
    await waitFor(() => {
      expect(screen.getByText('Categoría eliminada exitosamente.')).toBeInTheDocument();
    });


    // Wait for the category to be removed from the list
    await waitFor(() => {
      expect(screen.queryByText('Category 1')).not.toBeInTheDocument();
    });
  });
});
