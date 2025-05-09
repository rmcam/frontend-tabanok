import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import MultimediaUploadForm from './MultimediaUploadForm';
import api from '@/lib/api';

import { useDropzone, DropzoneState } from 'react-dropzone';
import { RefObject } from 'react';

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
// Mock react-dropzone
vi.mock('react-dropzone', () => ({
  useDropzone: vi.fn(),
}));

describe('MultimediaUploadForm', () => {
  const mockGetRootProps = vi.fn((props = {}) => props);
  const mockGetInputProps = vi.fn((props = {}) => props);
  const mockOnDrop = vi.fn(); // Mock the onDrop callback

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementation for useDropzone
    vi.mocked(useDropzone).mockReturnValue({
      getRootProps: mockGetRootProps,
      getInputProps: mockGetInputProps,
      isDragActive: false,
      acceptedFiles: [],
      onDrop: mockOnDrop, // Provide the mock onDrop
      isFocused: false,
      isFileDialogActive: false,
      isDragAccept: false,
      isDragReject: false,
      fileRejections: [],
      open: vi.fn(),
      rootRef: { current: null } as RefObject<HTMLElement>,
      inputRef: { current: null } as RefObject<HTMLInputElement>,
    } as DropzoneState);
  });

  it('renders the multimedia upload form', () => {
    render(<MultimediaUploadForm />);

    expect(screen.getByText('Subir Archivo Multimedia')).toBeInTheDocument();
    expect(screen.getByText(/Tipos de archivo permitidos/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Descripción/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Etiquetas/i)).toBeInTheDocument();
    expect(screen.getByText('Arrastra y suelta el archivo aquí, o haz clic para seleccionar un archivo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Subir/i })).toBeInTheDocument();
  });

  it('updates title, description, and tags on input change', async () => {
    render(<MultimediaUploadForm />);
    const user = userEvent.setup();

    const titleInput = screen.getByLabelText(/Título/i);
    const descriptionTextarea = screen.getByLabelText(/Descripción/i);
    const tagsInput = screen.getByLabelText(/Etiquetas/i);

    await user.type(titleInput, 'New Multimedia Title');
    await user.type(descriptionTextarea, 'This is a new multimedia description.');
    await user.type(tagsInput, 'tag1, tag2');

    expect(titleInput).toHaveValue('New Multimedia Title');
    expect(descriptionTextarea).toHaveValue('This is a new multimedia description.');
    expect(tagsInput).toHaveValue('tag1, tag2');
  });

  it('shows validation error if no file is selected on upload', async () => {
    render(<MultimediaUploadForm />);
    const user = userEvent.setup();

    const uploadButton = screen.getByRole('button', { name: /Subir/i });

    await act(async () => {
      await user.click(uploadButton);
    });

    await screen.findByText('Por favor, selecciona un archivo.');
    expect(api.put).not.toHaveBeenCalled();
  });

  it('shows validation error if title is empty on upload', async () => {
    render(<MultimediaUploadForm />);
    const user = userEvent.setup();

    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });

    // Simulate file drop by calling the mocked onDrop
    await act(async () => {
      mockOnDrop([file]);
    });

    // Mock useDropzone to return the accepted file after the drop
    vi.mocked(useDropzone).mockReturnValue({
      getRootProps: mockGetRootProps,
      getInputProps: mockGetInputProps,
      isDragActive: false,
      acceptedFiles: [file], // Simulate file being accepted
      onDrop: mockOnDrop,
      isFocused: false,
      isFileDialogActive: false,
      isDragAccept: false,
      isDragReject: false,
      fileRejections: [],
      open: vi.fn(),
      rootRef: { current: null } as RefObject<HTMLElement>,
      inputRef: { current: null } as RefObject<HTMLInputElement>,
    } as DropzoneState);

    // Re-render the component to reflect the state change from onDrop
    render(<MultimediaUploadForm />);

    // Wait for the file name to appear in the UI
    await screen.findByText(`Archivo seleccionado: ${file.name}`);

    const uploadButton = screen.getByRole('button', { name: /Subir/i });

    await act(async () => {
      await user.click(uploadButton);
    });

    expect(screen.getByText('El título es obligatorio.')).toBeInTheDocument();
    expect(api.put).not.toHaveBeenCalled();
  });

  it('calls api.put and shows success message on successful upload', async () => {
    const file = new File(['dummy content'], 'test.mp4', { type: 'video/mp4' });
    vi.mocked(api.put).mockResolvedValue({ url: 'http://example.com/uploaded/test.mp4' });

    render(<MultimediaUploadForm />);
    const user = userEvent.setup();

    const titleInput = screen.getByLabelText(/Título/i);
    const descriptionTextarea = screen.getByLabelText(/Descripción/i);
    const tagsInput = screen.getByLabelText(/Etiquetas/i);

    // Simulate file drop by calling the mocked onDrop
    await act(async () => {
      mockOnDrop([file]);
    });

    // Mock useDropzone to return the accepted file after the drop
    vi.mocked(useDropzone).mockReturnValue({
      getRootProps: mockGetRootProps,
      getInputProps: mockGetInputProps,
      isDragActive: false,
      acceptedFiles: [file], // Simulate file being accepted
      onDrop: mockOnDrop,
      isFocused: false,
      isFileDialogActive: false,
      isDragAccept: false,
      isDragReject: false,
      fileRejections: [],
      open: vi.fn(),
      rootRef: { current: null } as RefObject<HTMLElement>,
      inputRef: { current: null } as RefObject<HTMLInputElement>,
    } as DropzoneState);

    // Re-render the component to reflect the state change from onDrop
    render(<MultimediaUploadForm />);

    // Wait for the file name to appear in the UI
    await screen.findByText(`Archivo seleccionado: ${file.name}`);

    const uploadButton = screen.getByRole('button', { name: /Subir/i });

    await act(async () => {
      await user.type(titleInput, 'Valid Video Title');
      await user.type(descriptionTextarea, 'Valid description.');
      await user.type(tagsInput, 'video, tutorial');
      await user.click(uploadButton);
    });

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/multimedia/upload', expect.any(FormData), {
        onUploadProgress: expect.any(Function),
  });

  it('sends correct FormData on successful upload', async () => {
    const file = new File(['dummy content'], 'test-upload.mp4', { type: 'video/mp4' });
    const mockPut = vi.mocked(api.put).mockResolvedValue({ url: 'http://example.com/uploaded/test-upload.mp4' });

    render(<MultimediaUploadForm />);
    const user = userEvent.setup();

    const titleInput = screen.getByLabelText(/Título/i);
    const descriptionTextarea = screen.getByLabelText(/Descripción/i);
    const tagsInput = screen.getByLabelText(/Etiquetas/i);

    // Simulate file drop by calling the mocked onDrop
    await act(async () => {
      mockOnDrop([file]);
    });

    // Mock useDropzone to return the accepted file after the drop
    vi.mocked(useDropzone).mockReturnValue({
      getRootProps: mockGetRootProps,
      getInputProps: mockGetInputProps,
      isDragActive: false,
      acceptedFiles: [file], // Simulate file being accepted
      onDrop: mockOnDrop,
      isFocused: false,
      isFileDialogActive: false,
      isDragAccept: false,
      isDragReject: false,
      fileRejections: [],
      open: vi.fn(),
      rootRef: { current: null } as RefObject<HTMLElement>,
      inputRef: { current: null } as RefObject<HTMLInputElement>,
    } as DropzoneState);

    // Re-render the component to reflect the state change from onDrop
    render(<MultimediaUploadForm />);

    // Wait for the file name to appear in the UI
    await screen.findByText(`Archivo seleccionado: ${file.name}`);

    const uploadButton = screen.getByRole('button', { name: /Subir/i });

    const testTitle = 'Test Upload Title';
    const testDescription = 'Test upload description.';
    const testTags = 'tagA, tagB, tagC';

    await act(async () => {
      await user.type(titleInput, testTitle);
      await user.type(descriptionTextarea, testDescription);
      await user.type(tagsInput, testTags);
      await user.click(uploadButton);
    });

    // Wait for api.put to be called
    await waitFor(() => {
      expect(mockPut).toHaveBeenCalled();
    });

    // Get the FormData from the mock call arguments
    const formDataSent = mockPut.mock.calls[0][1] as FormData;

    // Verify FormData contents
    expect(formDataSent.get('multimedia')).toBeInstanceOf(File);
    expect((formDataSent.get('multimedia') as File).name).toBe('test-upload.mp4');
    expect((formDataSent.get('multimedia') as File).type).toBe('video/mp4');
    expect(formDataSent.get('title')).toBe(testTitle);
    expect(formDataSent.get('description')).toBe(testDescription);

    // Verify tags - FormData.getAll returns an array for multiple entries with the same key
    const tagsArray = formDataSent.getAll('tags[]');
    expect(tagsArray).toEqual(['tagA', 'tagB', 'tagC']);

    // Assert success message (optional, already covered by another test)
    await waitFor(() => {
      expect(screen.getByText('Archivo subido con éxito: http://example.com/uploaded/test-upload.mp4')).toBeInTheDocument();
    });
  });
});

    await waitFor(() => {
      expect(screen.getByText('Archivo subido con éxito: http://example.com/uploaded/test.mp4')).toBeInTheDocument();
    });

    expect(titleInput).toHaveValue('');
    expect(descriptionTextarea).toHaveValue('');
    expect(tagsInput).toHaveValue('');
  });

  it('shows error message on api.put failure', async () => {
    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
    const errorMessage = 'Upload failed';
    vi.mocked(api.put).mockRejectedValue(new Error(errorMessage));

    render(<MultimediaUploadForm />);
    const user = userEvent.setup();

    const titleInput = screen.getByLabelText(/Título/i);

    // Simulate file drop by calling the mocked onDrop
    await act(async () => {
      mockOnDrop([file]);
    });

    // Mock useDropzone to return the accepted file after the drop
    vi.mocked(useDropzone).mockReturnValue({
      getRootProps: mockGetRootProps,
      getInputProps: mockGetInputProps,
      isDragActive: false,
      acceptedFiles: [file], // Simulate file being accepted
      onDrop: mockOnDrop,
      isFocused: false,
      isFileDialogActive: false,
      isDragAccept: false,
      isDragReject: false,
      fileRejections: [],
      open: vi.fn(),
      rootRef: { current: null } as RefObject<HTMLElement>,
      inputRef: { current: null } as RefObject<HTMLInputElement>,
    } as DropzoneState);

    // Re-render the component to reflect the state change from onDrop
    render(<MultimediaUploadForm />);

    // Wait for the file name to appear in the UI
    await screen.findByText(`Archivo seleccionado: ${file.name}`);

    const uploadButton = screen.getByRole('button', { name: /Subir/i });

    await act(async () => {
      await user.type(titleInput, 'Valid Image Title');
      await user.click(uploadButton);
    });

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/multimedia/upload', expect.any(FormData), {
        onUploadProgress: expect.any(Function),
      });
    });

    await waitFor(() => {
      expect(screen.getByText(`Error al subir el archivo: Error: ${errorMessage}`)).toBeInTheDocument();
    });

    expect(titleInput).toHaveValue('Valid Image Title');
  });

  it('disables upload button and inputs while uploading', async () => {
    const file = new File(['dummy content'], 'test.gif', { type: 'image/gif' });
    vi.mocked(api.put).mockReturnValue(new Promise(() => {}));

    render(<MultimediaUploadForm />);
    const user = userEvent.setup();

    const titleInput = screen.getByLabelText(/Título/i);
    const descriptionTextarea = screen.getByLabelText(/Descripción/i);
    const tagsInput = screen.getByLabelText(/Etiquetas/i);

    // Simulate file drop by calling the mocked onDrop
    await act(async () => {
      mockOnDrop([file]);
    });

    // Mock useDropzone to return the accepted file after the drop
    vi.mocked(useDropzone).mockReturnValue({
      getRootProps: mockGetRootProps,
      getInputProps: mockGetInputProps,
      isDragActive: false,
      acceptedFiles: [file], // Simulate file being accepted
      onDrop: mockOnDrop,
      isFocused: false,
      isFileDialogActive: false,
      isDragAccept: false,
      isDragReject: false,
      fileRejections: [],
      open: vi.fn(),
      rootRef: { current: null } as RefObject<HTMLElement>,
      inputRef: { current: null } as RefObject<HTMLInputElement>,
    } as DropzoneState);

    // Re-render the component to reflect the state change from onDrop
    render(<MultimediaUploadForm />);

    // Wait for the file name to appear in the UI
    await screen.findByText(`Archivo seleccionado: ${file.name}`);

    const uploadButton = screen.getByRole('button', { name: /Subir/i });

    await act(async () => {
      await user.type(titleInput, 'Title');
      await user.type(descriptionTextarea, 'Description');
      await user.type(tagsInput, 'tags');
      await user.click(uploadButton);
    });

    expect(uploadButton).toBeDisabled();
    await screen.findByRole('button', { name: /Subiendo.../i });
    expect(titleInput).toBeDisabled();
    expect(descriptionTextarea).toBeDisabled();
    expect(tagsInput).toBeDisabled();
    await waitFor(() => {
      expect(screen.getByText('Subiendo archivo...').closest('div')).toHaveClass('disabled');
    });
  });

  it('clears file error when a file is dropped', async () => {
    render(<MultimediaUploadForm />);
    const user = userEvent.setup();

    const uploadButton = screen.getByRole('button', { name: /Subir/i });

    await act(async () => {
      await user.click(uploadButton);
    });

    await screen.findByText('Por favor, selecciona un archivo.');

    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });

    // Simulate file drop by calling the mocked onDrop
    await act(async () => {
      mockOnDrop([file]);
    });

    // Mock useDropzone to return the accepted file after the drop
    vi.mocked(useDropzone).mockReturnValue({
      getRootProps: mockGetRootProps,
      getInputProps: mockGetInputProps,
      isDragActive: false,
      acceptedFiles: [file], // Simulate file being accepted
      onDrop: mockOnDrop,
      isFocused: false,
      isFileDialogActive: false,
      isDragAccept: false,
      isDragReject: false,
      fileRejections: [],
      open: vi.fn(),
      rootRef: { current: null } as RefObject<HTMLElement>,
      inputRef: { current: null } as RefObject<HTMLInputElement>,
    } as DropzoneState);

    // Re-render the component to reflect the state change from onDrop
    render(<MultimediaUploadForm />);

    await waitFor(() => {
      expect(screen.queryByText('Por favor, selecciona un archivo.')).not.toBeInTheDocument();
    });
    expect(screen.getByText(`Archivo seleccionado: ${file.name}`)).toBeInTheDocument();
  });
});
