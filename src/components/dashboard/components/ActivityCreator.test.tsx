import { render, screen } from '@testing-library/react'; // Removed fireEvent
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ActivityCreator from './ActivityCreator';
import api from '@/lib/api';
import { toast } from 'sonner';

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

describe('ActivityCreator', () => {
  // Clear mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the activity creator form', () => {
    render(<ActivityCreator />);

    expect(screen.getByText('Creación de Actividades')).toBeInTheDocument();
    expect(screen.getByLabelText(/Título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Descripción/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Guardar Actividad/i })).toBeInTheDocument();
  });

  it('updates title and description on input change', async () => {
    render(<ActivityCreator />);
    const user = userEvent.setup();

    const titleInput = screen.getByLabelText(/Título/i);
    const descriptionTextarea = screen.getByLabelText(/Descripción/i);

    await user.type(titleInput, 'New Activity Title');
    await user.type(descriptionTextarea, 'This is a new activity description.');

    expect(titleInput).toHaveValue('New Activity Title');
    expect(descriptionTextarea).toHaveValue('This is a new activity description.');
  });

  it('shows validation error if title is empty on save', async () => {
    render(<ActivityCreator />);
    const user = userEvent.setup();

    const saveButton = screen.getByRole('button', { name: /Guardar Actividad/i });

    await user.click(saveButton);

    expect(screen.getByText('El título es obligatorio.')).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled(); // Validation errors are now displayed below input
  });

  it('shows validation error if title is less than 3 characters', async () => {
    render(<ActivityCreator />);
    const user = userEvent.setup();

    const titleInput = screen.getByLabelText(/Título/i);
    const saveButton = screen.getByRole('button', { name: /Guardar Actividad/i });

    await user.type(titleInput, 'Ab');
    await user.click(saveButton);

    expect(screen.getByText('El título debe tener al menos 3 caracteres.')).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('shows validation error if title contains invalid characters', async () => {
    render(<ActivityCreator />);
    const user = userEvent.setup();

    const titleInput = screen.getByLabelText(/Título/i);
    const saveButton = screen.getByRole('button', { name: /Guardar Actividad/i });

    await user.type(titleInput, 'Invalid Title!');
    await user.click(saveButton);

    expect(screen.getByText('El título solo puede contener letras, números y espacios.')).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('shows validation error if description is less than 10 characters', async () => {
    render(<ActivityCreator />);
    const user = userEvent.setup();

    const titleInput = screen.getByLabelText(/Título/i);
    const descriptionTextarea = screen.getByLabelText(/Descripción/i);
    const saveButton = screen.getByRole('button', { name: /Guardar Actividad/i });

    await user.type(titleInput, 'Valid Title');
    await user.type(descriptionTextarea, 'Short');
    await user.click(saveButton);

    expect(screen.getByText('La descripción debe tener al menos 10 caracteres.')).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });


  it('calls api.post and shows success toast on successful save', async () => {
    // Mock the api.post to resolve successfully
    vi.mocked(api.post).mockResolvedValue({});

    render(<ActivityCreator />);
    const user = userEvent.setup();

    const titleInput = screen.getByLabelText(/Título/i);
    const descriptionTextarea = screen.getByLabelText(/Descripción/i);
    const saveButton = screen.getByRole('button', { name: /Guardar Actividad/i });

    await user.type(titleInput, 'Valid Activity Title');
    await user.type(descriptionTextarea, 'This is a valid description with more than 10 characters.');
    await user.click(saveButton);

    // Expect api.post to have been called with the correct data
    expect(api.post).toHaveBeenCalledWith('/activities', {
      title: 'Valid Activity Title',
      description: 'This is a valid description with more than 10 characters.',
    });

    // Expect success toast to have been shown
    expect(toast.success).toHaveBeenCalledWith('Actividad creada!', {
      description: 'La actividad se ha guardado correctamente.',
    });

    // Expect form fields to be cleared
    expect(titleInput).toHaveValue('');
    expect(descriptionTextarea).toHaveValue('');
  });

  it('shows error toast on api.post failure', async () => {
    // Mock the api.post to reject with an error
    const errorMessage = 'Network Error';
    vi.mocked(api.post).mockRejectedValue(new Error(errorMessage));

    render(<ActivityCreator />);
    const user = userEvent.setup();

    const titleInput = screen.getByLabelText(/Título/i);
    const descriptionTextarea = screen.getByLabelText(/Descripción/i);
    const saveButton = screen.getByRole('button', { name: /Guardar Actividad/i });

    await user.type(titleInput, 'Valid Activity Title');
    await user.type(descriptionTextarea, 'This is a valid description with more than 10 characters.');
    await user.click(saveButton);

    // Expect api.post to have been called
    expect(api.post).toHaveBeenCalledWith('/activities', {
      title: 'Valid Activity Title',
      description: 'This is a valid description with more than 10 characters.',
    });

    // Expect error toast to have been shown
    expect(toast.error).toHaveBeenCalledWith('Error!', {
      description: 'Hubo un error al guardar la actividad.',
    });

    // Expect form fields not to be cleared on error
    expect(titleInput).toHaveValue('Valid Activity Title');
    expect(descriptionTextarea).toHaveValue('This is a valid description with more than 10 characters.');
  });

  it('disables save button while loading', async () => {
    // Mock api.post to return a promise that never resolves to keep it in loading state
    vi.mocked(api.post).mockReturnValue(new Promise(() => {}));

    render(<ActivityCreator />);
    const user = userEvent.setup();

    const titleInput = screen.getByLabelText(/Título/i);
    const descriptionTextarea = screen.getByLabelText(/Descripción/i);
    const saveButton = screen.getByRole('button', { name: /Guardar Actividad/i });

    await user.type(titleInput, 'Valid Title');
    await user.type(descriptionTextarea, 'Valid description with enough characters.');
    await user.click(saveButton);

    expect(saveButton).toBeDisabled();
    expect(screen.getByRole('button', { name: /Guardando.../i })).toBeInTheDocument();
  });
});
