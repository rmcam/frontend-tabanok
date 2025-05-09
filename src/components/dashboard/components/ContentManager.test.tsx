import { render, screen, waitFor, within } from "@testing-library/react"; // Removed fireEvent, Import within
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ContentManager from "./ContentManager";
import api from "@/lib/api";
import { toast } from 'sonner'; // Import toast


// Mock the api module
vi.mock("@/lib/api");
// Mock the sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));
// Mock react-quill
vi.mock("react-quill", () => ({
  __esModule: true,
  default: vi.fn(({ value, onChange, ...props }) => (
    <textarea
      data-testid="react-quill-mock"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...props}
    />
  )),
}));

describe("ContentManager", () => {
  const mockContents = [
    {
      id: 1,
      title: "Content 1",
      description: "Desc 1",
      category: "1",
      tags: ["tag1"],
      type: "texto",
      content: "<p>Text 1</p>",
      multimediaItems: [],
    },
    {
      id: 2,
      title: "Content 2",
      description: "Desc 2",
      category: "2",
      tags: ["tag2"],
      type: "imagen",
      content: null,
      multimediaItems: [
        {
          id: "multimedia1",
          title: "Image 1",
          description: "",
          type: "image",
          url: "http://example.com/img1.jpg",
          lessonId: "lesson1",
          metadata: {},
        },
      ],
    },
  ];
  const mockCategories = [
    { id: 1, name: "Category A" },
    { id: 2, name: "Category B" },
  ];
  const mockTags = [
    { id: 1, name: "tag1" },
    { id: 2, name: "tag2" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementations for API calls
    vi.mocked(api.get).mockImplementation((url) => {
      if (url === "/contents") return Promise.resolve(mockContents);
      if (url === "/categories") return Promise.resolve(mockCategories);
      if (url === "/tags") return Promise.resolve(mockTags);
      return Promise.reject(new Error("Unknown API endpoint"));
    });
    vi.mocked(api.post).mockResolvedValue(undefined); // Changed to undefined
    vi.mocked(api.put).mockResolvedValue(undefined); // Changed to undefined
    vi.mocked(api.delete).mockResolvedValue(undefined); // Changed to undefined
  });

  it("renders the content manager with existing contents", async () => {
    render(<ContentManager />);

    // Wait for data to load
    await waitFor(() =>
      expect(screen.getByText("Contenidos Existentes")).toBeInTheDocument()
    );

    expect(screen.getByText("Gestión de Contenidos")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Crear Nuevo Contenido/i })
    ).toBeInTheDocument();

    // Check if existing contents are displayed in the table
    expect(screen.getByText("Content 1")).toBeInTheDocument();
    expect(screen.getByText("Content 2")).toBeInTheDocument();
    expect(screen.getByText("Category A")).toBeInTheDocument(); // Assuming category name is displayed
    expect(screen.getByText("Category B")).toBeInTheDocument();
    expect(screen.getByText("tag1")).toBeInTheDocument(); // Assuming tags are displayed
    expect(screen.getByText("tag2")).toBeInTheDocument();
    expect(screen.getByText("texto")).toBeInTheDocument();
    expect(screen.getByText("imagen")).toBeInTheDocument();
  });

  it('shows the form when "Crear Nuevo Contenido" button is clicked', async () => {
    render(<ContentManager />);
    const user = userEvent.setup();

    await waitFor(() =>
      expect(screen.getByText("Contenidos Existentes")).toBeInTheDocument()
    );

    const createButton = screen.getByRole("button", {
      name: /Crear Nuevo Contenido/i,
    });
    await user.click(createButton);

    expect(screen.getByText("Crear Nuevo Contenido")).toBeInTheDocument(); // Form title
    expect(screen.getByLabelText(/Título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Descripción/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Categoría/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Etiquetas/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tipo de Contenido/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Guardar/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Cancelar/i })
    ).toBeInTheDocument();
  });

  it('creates a new text content', async () => {
    render(<ContentManager />);
    const user = userEvent.setup();

    // Wait for initial data to load
    await waitFor(() =>
      expect(screen.getByText("Contenidos Existentes")).toBeInTheDocument()
    );

    // Mock api.post to resolve successfully
    vi.mocked(api.post).mockResolvedValueOnce({ id: 3, ...mockContents[0], title: 'New Content', content: '<p>New Text</p>' });

    // Mock api.get to return the updated list after creation
    vi.mocked(api.get).mockImplementationOnce((url) => {
      if (url === "/contents") return Promise.resolve(mockContents);
      if (url === "/categories") return Promise.resolve(mockCategories);
      if (url === "/tags") return Promise.resolve(mockTags);
      return Promise.reject(new Error("Unknown API endpoint"));
    }).mockResolvedValueOnce([...mockContents, { id: 3, title: 'New Content', description: 'New Desc', category: '1', tags: ['newtag'], type: 'texto', content: '<p>New Text</p>', multimediaItems: [] }]);


    const createButton = screen.getByRole("button", {
      name: /Crear Nuevo Contenido/i,
    });
    await user.click(createButton);

    // Fill the form
    const titleInput = screen.getByLabelText(/Título/i);
    const descriptionInput = screen.getByLabelText(/Descripción/i);
    const categorySelectTrigger = screen.getByLabelText(/Categoría/i);
    const tagsInput = screen.getByLabelText(/Etiquetas/i);
    const addTagButton = screen.getByRole('button', { name: 'Agregar' });
    const contentTypeSelectTrigger = screen.getByLabelText(/Tipo de Contenido/i);
    const contentTextarea = screen.getByTestId('react-quill-mock'); // Use data-testid for the mocked ReactQuill

    await user.type(titleInput, 'New Content');
    await user.type(descriptionInput, 'New Desc');

    await user.click(categorySelectTrigger);
    await user.click(screen.getByText('Category A')); // Select Category A

    await user.type(tagsInput, 'newtag');
    await user.click(addTagButton);

    await user.click(contentTypeSelectTrigger);
    await user.click(screen.getByText('Texto')); // Select Texto

    await user.type(contentTextarea, 'New Text');

    const saveButton = screen.getByRole("button", { name: /Guardar/i });
    await user.click(saveButton);

    // Assert API call
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/contents', JSON.stringify({
        title: 'New Content',
        description: 'New Desc',
        category: '1', // Assuming category is sent as ID
        tags: ['newtag'],
        type: 'texto',
        content: '<p>New Text</p>',
      }));
    });

    // Assert success toast
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Contenido guardado!', {
        description: 'El contenido se ha guardado correctamente.',
      });
    });

    // Wait for the new content to appear in the table
    await waitFor(() => {
      expect(screen.getByText('New Content')).toBeInTheDocument();
      expect(screen.getByText('New Desc')).toBeInTheDocument();
      expect(screen.getByText('Category A')).toBeInTheDocument(); // Assuming category name is displayed
      expect(screen.getByText('newtag')).toBeInTheDocument();
      expect(screen.getByText('texto')).toBeInTheDocument();
    });
  });

  it('updates an existing text content', async () => {
    render(<ContentManager />);
    const user = userEvent.setup();

    // Wait for initial data to load
    await waitFor(() =>
      expect(screen.getByText("Contenidos Existentes")).toBeInTheDocument()
    );

    // Find the row for Content 1
    const content1Row = screen.getByText('Content 1').closest('tr');
    // Use within to find the Edit button within that row
    const editButton = within(content1Row as HTMLElement).getByRole('button', { name: 'Editar' });

    await user.click(editButton);

    // Check if the form is shown with the content data
    expect(screen.getByText('Editar Contenido')).toBeInTheDocument();
    const titleInput = screen.getByLabelText(/Título/i);
    const descriptionInput = screen.getByLabelText(/Descripción/i);
    const contentTextarea = screen.getByTestId('react-quill-mock');

    expect(titleInput).toHaveValue('Content 1');
    expect(descriptionInput).toHaveValue('Desc 1');
    expect(contentTextarea).toHaveValue('<p>Text 1</p>');

    // Type the updated information
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Content 1');
    await user.clear(descriptionInput);
    await user.type(descriptionInput, 'Updated Desc 1');
    await user.clear(contentTextarea);
    await user.type(contentTextarea, '<p>Updated Text 1</p>');

    // Mock api.put to resolve successfully
    vi.mocked(api.put).mockResolvedValueOnce(undefined);

    // Mock api.get to return the updated list after update
    vi.mocked(api.get).mockImplementationOnce((url) => {
      if (url === "/contents") return Promise.resolve(mockContents);
      if (url === "/categories") return Promise.resolve(mockCategories);
      if (url === "/tags") return Promise.resolve(mockTags);
      return Promise.reject(new Error("Unknown API endpoint"));
    }).mockResolvedValueOnce([{ ...mockContents[0], title: 'Updated Content 1', description: 'Updated Desc 1', content: '<p>Updated Text 1</p>' }, mockContents[1]]);


    const saveButton = screen.getByRole("button", { name: /Guardar/i });
    await user.click(saveButton);

    // Assert API call
    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/contents/1', JSON.stringify({
        title: 'Updated Content 1',
        description: 'Updated Desc 1',
        category: '1', // Assuming category is sent as ID
        tags: ['tag1'], // Assuming tags are not changed in this test
        type: 'texto',
        content: '<p>Updated Text 1</p>',
      }));
    });

    // Assert success toast
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Contenido actualizado!', {
        description: 'El contenido se ha actualizado correctamente.',
      });
    });

    // Wait for the updated content to appear in the table
    await waitFor(() => {
      expect(screen.getByText('Updated Content 1')).toBeInTheDocument();
      expect(screen.getByText('Updated Desc 1')).toBeInTheDocument();
      expect(screen.getByText('Category A')).toBeInTheDocument(); // Assuming category name is displayed
      expect(screen.getByText('tag1')).toBeInTheDocument();
      expect(screen.getByText('texto')).toBeInTheDocument();
    });
  });

  it('deletes an existing content', async () => {
    render(<ContentManager />);
    const user = userEvent.setup();

    // Wait for initial data to load
    await waitFor(() =>
      expect(screen.getByText("Contenidos Existentes")).toBeInTheDocument()
    );

    // Find the row for Content 1
    const content1Row = screen.getByText('Content 1').closest('tr');
    // Use within to find the Delete button within that row
    const deleteButton = within(content1Row as HTMLElement).getByRole('button', { name: 'Eliminar' });

    // Mock api.delete to resolve successfully
    vi.mocked(api.delete).mockResolvedValueOnce(undefined);

    await user.click(deleteButton);

    // Assert API call
    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('/contents/1');
    });

    // Assert success toast
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Contenido eliminado!', {
        description: 'El contenido se ha eliminado correctamente.',
      });
    });

    // Wait for the content to be removed from the table
    await waitFor(() => {
      expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    });
  });

  it('creates a new image content', async () => {
    render(<ContentManager />);
    const user = userEvent.setup();

    // Wait for initial data to load
    await waitFor(() =>
      expect(screen.getByText("Contenidos Existentes")).toBeInTheDocument()
    );

    // Mock api.post to resolve successfully
    vi.mocked(api.post).mockResolvedValueOnce({ id: 3, ...mockContents[1], title: 'New Image Content', multimediaItems: [{ id: 'newmedia1', url: 'http://example.com/newimg.jpg', type: 'image', title: 'New Image' }] });

    // Mock api.get to return the updated list after creation
    vi.mocked(api.get).mockImplementationOnce((url) => {
      if (url === "/contents") return Promise.resolve(mockContents);
      if (url === "/categories") return Promise.resolve(mockCategories);
      if (url === "/tags") return Promise.resolve(mockTags);
      return Promise.reject(new Error("Unknown API endpoint"));
    }).mockResolvedValueOnce([...mockContents, { id: 3, title: 'New Image Content', description: 'New Image Desc', category: '1', tags: ['newimagetag'], type: 'imagen', content: null, multimediaItems: [{ id: 'newmedia1', url: 'http://example.com/newimg.jpg', type: 'image', title: 'New Image' }] }]);


    const createButton = screen.getByRole("button", {
      name: /Crear Nuevo Contenido/i,
    });
    await user.click(createButton);

    // Fill the form
    const titleInput = screen.getByLabelText(/Título/i);
    const descriptionInput = screen.getByLabelText(/Descripción/i);
    const categorySelectTrigger = screen.getByLabelText(/Categoría/i);
    const tagsInput = screen.getByLabelText(/Etiquetas/i);
    const addTagButton = screen.getByRole('button', { name: 'Agregar' });
    const contentTypeSelectTrigger = screen.getByLabelText(/Tipo de Contenido/i);
    const fileInput = screen.getByLabelText(/Archivo/i);

    await user.type(titleInput, 'New Image Content');
    await user.type(descriptionInput, 'New Image Desc');

    await user.click(categorySelectTrigger);
    await user.click(screen.getByText('Category A')); // Select Category A

    await user.type(tagsInput, 'newimagetag');
    await user.click(addTagButton);

    await user.click(contentTypeSelectTrigger);
    await user.click(screen.getByText('Imagen')); // Select Imagen

    // Simulate file selection
    const imageFile = new File(['(binary data)'], 'test-image.png', { type: 'image/png' });
    await user.upload(fileInput, imageFile);


    const saveButton = screen.getByRole("button", { name: /Guardar/i });
    await user.click(saveButton);

    // Assert API call - checking FormData content is tricky,
    // we'll check if api.post was called with an instance of FormData
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/contents', expect.any(FormData));
    });

    // Optional: Further assertions to check FormData content if needed,
    // but it's more complex and might require custom matchers or inspecting the mock call arguments.
    // For now, we'll rely on the type check.

    // Assert success toast
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Contenido guardado!', {
        description: 'El contenido se ha guardado correctamente.',
      });
    });

    // Wait for the new content to appear in the table
    await waitFor(() => {
      expect(screen.getByText('New Image Content')).toBeInTheDocument();
      expect(screen.getByText('New Image Desc')).toBeInTheDocument();
      expect(screen.getByText('Category A')).toBeInTheDocument(); // Assuming category name is displayed
      expect(screen.getByText('newimagetag')).toBeInTheDocument();
      expect(screen.getByText('imagen')).toBeInTheDocument();
    });
  });


  it('updates an existing image content', async () => {
    render(<ContentManager />);
    const user = userEvent.setup();

    // Wait for initial data to load
    await waitFor(() =>
      expect(screen.getByText("Contenidos Existentes")).toBeInTheDocument()
    );

    // Find the row for Content 2 (image content)
    const content2Row = screen.getByText('Content 2').closest('tr');
    // Use within to find the Edit button within that row
    const editButton = within(content2Row as HTMLElement).getByRole('button', { name: 'Editar' });

    await user.click(editButton);

    // Check if the form is shown with the content data and associated multimedia
    expect(screen.getByText('Editar Contenido')).toBeInTheDocument();
    const titleInput = screen.getByLabelText(/Título/i);
    const descriptionInput = screen.getByLabelText(/Descripción/i);
    const fileInput = screen.getByLabelText(/Archivo/i);
    expect(screen.getByText('Multimedia Asociada')).toBeInTheDocument();
    expect(screen.getByText('Image 1')).toBeInTheDocument(); // Assuming MultimediaPlayer displays title


    expect(titleInput).toHaveValue('Content 2');
    expect(descriptionInput).toHaveValue('Desc 2');

    // Type the updated information
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Content 2');
    await user.clear(descriptionInput);
    await user.type(descriptionInput, 'Updated Desc 2');

    // Simulate selecting a new file
    const newImageFile = new File(['(new binary data)'], 'new-test-image.png', { type: 'image/png' });
    await user.upload(fileInput, newImageFile);

    // Mock api.put to resolve successfully
    vi.mocked(api.put).mockResolvedValueOnce(undefined);

    // Mock api.get to return the updated list after update
    vi.mocked(api.get).mockImplementationOnce((url) => {
      if (url === "/contents") return Promise.resolve(mockContents);
      if (url === "/categories") return Promise.resolve(mockCategories);
      if (url === "/tags") return Promise.resolve(mockTags);
      return Promise.reject(new Error("Unknown API endpoint"));
    }).mockResolvedValueOnce([mockContents[0], { ...mockContents[1], title: 'Updated Content 2', description: 'Updated Desc 2', multimediaItems: [{ id: 'newmedia2', url: 'http://example.com/newimg2.jpg', type: 'image', title: 'New Image 2' }] }]);


    const saveButton = screen.getByRole("button", { name: /Guardar/i });
    await user.click(saveButton);

    // Assert API call - checking FormData content is tricky,
    // we'll check if api.put was called with an instance of FormData
    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/contents/2', expect.any(FormData));
    });

    // Optional: Further assertions to check FormData content if needed.

    // Assert success toast
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Contenido actualizado!', {
        description: 'El contenido se ha actualizado correctamente.',
      });
    });

    // Wait for the updated content to appear in the table
    await waitFor(() => {
      expect(screen.getByText('Updated Content 2')).toBeInTheDocument();
      expect(screen.getByText('Updated Desc 2')).toBeInTheDocument();
      expect(screen.getByText('Category B')).toBeInTheDocument(); // Assuming category name is displayed
      expect(screen.getByText('tag2')).toBeInTheDocument();
      expect(screen.getByText('imagen')).toBeInTheDocument();
      // The old multimedia item should be gone, and potentially a new one displayed depending on component logic
      expect(screen.queryByText('Image 1')).not.toBeInTheDocument();
    });
  });


  it('deletes an associated multimedia item from existing content', async () => {
    render(<ContentManager />);
    const user = userEvent.setup();

    // Wait for initial data to load
    await waitFor(() =>
      expect(screen.getByText("Contenidos Existentes")).toBeInTheDocument()
    );

    // Find the row for Content 2 (image content with associated multimedia)
    const content2Row = screen.getByText('Content 2').closest('tr');
    // Use within to find the Edit button within that row
    const editButton = within(content2Row as HTMLElement).getByRole('button', { name: 'Editar' });

    await user.click(editButton);

    // Check if the form is shown with associated multimedia
    expect(screen.getByText('Editar Contenido')).toBeInTheDocument();
    expect(screen.getByText('Multimedia Asociada')).toBeInTheDocument();
    const multimediaItem = screen.getByText('Image 1'); // Assuming MultimediaPlayer displays title
    expect(multimediaItem).toBeInTheDocument();

    // Find the delete button for the associated multimedia item using within
    const deleteMultimediaButton = within(multimediaItem.closest('.relative') as HTMLElement).getByRole('button', { name: 'X' });

    // Mock api.delete for multimedia to resolve successfully
    vi.mocked(api.delete).mockResolvedValueOnce(undefined);

    // Mock api.get to return the updated list after multimedia deletion
    vi.mocked(api.get).mockImplementationOnce((url) => {
      if (url === "/contents") return Promise.resolve(mockContents);
      if (url === "/categories") return Promise.resolve(mockCategories);
      if (url === "/tags") return Promise.resolve(mockTags);
      return Promise.reject(new Error("Unknown API endpoint"));
    }).mockResolvedValueOnce([mockContents[0], { ...mockContents[1], multimediaItems: [] }]); // Content 2 without multimedia


    await user.click(deleteMultimediaButton);

    // Assert API call to delete multimedia
    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('/multimedia/multimedia1'); // Assuming multimedia ID is 'multimedia1'
    });

    // Assert success toast for multimedia deletion
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Archivo multimedia eliminado!', {
        description: 'El archivo multimedia se ha eliminado correctamente.',
      });
    });

    // Wait for the multimedia item to be removed from the form
    await waitFor(() => {
      expect(screen.queryByText('Image 1')).not.toBeInTheDocument();
    });

    // Wait for the content list to be refetched and updated in the table
    await waitFor(() => {
        // Check if Content 2 is still in the table but its multimedia is gone (this might require inspecting the rendered component's state or re-checking the table display based on how the component updates)
        // For simplicity in this test, we'll just check if the content list was refetched.
        expect(api.get).toHaveBeenCalledWith('/contents');
    });
  });


  it('shows validation errors for missing required fields (text content)', async () => {
    render(<ContentManager />);
    const user = userEvent.setup();

    // Wait for initial data to load
    await waitFor(() =>
      expect(screen.getByText("Contenidos Existentes")).toBeInTheDocument()
    );

    const createButton = screen.getByRole("button", {
      name: /Crear Nuevo Contenido/i,
    });
    await user.click(createButton);

    // Do NOT fill in any required fields

    const saveButton = screen.getByRole("button", { name: /Guardar/i });
    await user.click(saveButton);

    // Assert validation error messages are displayed
    await waitFor(() => {
      expect(screen.getByText('El título es obligatorio.')).toBeInTheDocument();
      expect(screen.getByText('La descripción es obligatoria.')).toBeInTheDocument();
      expect(screen.getByText('La categoría es obligatoria.')).toBeInTheDocument();
      expect(screen.getByText('El tipo de contenido es obligatorio.')).toBeInTheDocument();
      // Content error for text type will appear after selecting text type,
      // but we can test the initial state where type is not selected.
    });

    // Select text type and check content validation
    const contentTypeSelectTrigger = screen.getByLabelText(/Tipo de Contenido/i);
    await user.click(contentTypeSelectTrigger);
    await user.click(screen.getByText('Texto')); // Select Texto

    await user.click(saveButton);

    await waitFor(() => {
        expect(screen.getByText('El contenido es obligatorio.')).toBeInTheDocument();
    });


    // Add more tests for form interactions, validation, save (create/edit), delete, multimedia handling, etc.
  });
});
