import useFormValidation from "@/hooks/useFormValidation";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import SigninForm from "./SigninForm";

// Mock the hooks used by SigninForm
jest.mock("@/hooks/useFormValidation");
jest.mock("../../auth/hooks/useAuth");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Mock translation function to return the key
  }),
}));

const mockUseFormValidation = useFormValidation as jest.Mock;
const mockUseAuth = useAuth as jest.Mock;
const mockUseNavigate = useNavigate as jest.Mock;

describe("SigninForm", () => {
  const mockHandleChange = jest.fn();
  const mockSignin = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    mockUseFormValidation.mockReset();
    mockUseAuth.mockReset();
    mockUseNavigate.mockReset();

    // Default mock implementations
    mockUseFormValidation.mockReturnValue({
      values: { identifier: "", password: "" },
      errors: {},
      isValid: false,
      handleChange: mockHandleChange,
    });

    mockUseAuth.mockReturnValue({
      signin: mockSignin,
      signingIn: false,
    });

    mockUseNavigate.mockReturnValue(mockNavigate);
  });

  test("renders correctly", () => {
    render(<SigninForm />);

    // Check if the form elements are present
    expect(
      screen.getByLabelText("auth.signin.label.username")
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("auth.signin.label.password")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "auth.signin.button.signIn" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("auth.signin.link.forgotPassword")
    ).toBeInTheDocument();
  });

  test("calls handleChange when input values change", () => {
    render(<SigninForm />);

    const usernameInput = screen.getByLabelText("auth.signin.label.username");
    const passwordInput = screen.getByLabelText("auth.signin.label.password");

    fireEvent.change(usernameInput, {
      target: { name: "identifier", value: "testuser" },
    });
    expect(mockHandleChange).toHaveBeenCalledWith(expect.any(Object)); // Check if handleChange was called

    fireEvent.change(passwordInput, {
      target: { name: "password", value: "password123" },
    });
    expect(mockHandleChange).toHaveBeenCalledWith(expect.any(Object)); // Check if handleChange was called
  });

  test("disables submit button when form is invalid", () => {
    mockUseFormValidation.mockReturnValue({
      values: { identifier: "", password: "" },
      errors: {},
      isValid: false, // Form is invalid
      handleChange: mockHandleChange,
    });

    render(<SigninForm />);
    const submitButton = screen.getByRole("button", {
      name: "auth.signin.button.signIn",
    });
    expect(submitButton).toBeDisabled();
  });

  test("enables submit button when form is valid", () => {
    mockUseFormValidation.mockReturnValue({
      values: { identifier: "testuser", password: "password123" },
      errors: {},
      isValid: true, // Form is valid
      handleChange: mockHandleChange,
    });

    render(<SigninForm />);
    const submitButton = screen.getByRole("button", {
      name: "auth.signin.button.signIn",
    });
    expect(submitButton).not.toBeDisabled();
  });

  test("shows loading indicator when signingIn is true", () => {
    mockUseAuth.mockReturnValue({
      signin: mockSignin,
      signingIn: true, // Signing in
    });
    mockUseFormValidation.mockReturnValue({
      values: { identifier: "testuser", password: "password123" },
      errors: {},
      isValid: true,
      handleChange: mockHandleChange,
    });

    render(<SigninForm />);
    expect(screen.getByTestId("loading-indicator")).toBeInTheDocument(); // Assuming Loading component has data-testid="loading-indicator"
    expect(
      screen.queryByText("auth.signin.button.signIn")
    ).not.toBeInTheDocument();
  });

  test("calls signin and navigates on successful submission", async () => {
    mockUseFormValidation.mockReturnValue({
      values: { identifier: "testuser", password: "password123" },
      errors: {},
      isValid: true,
      handleChange: mockHandleChange,
    });
    mockSignin.mockResolvedValue(undefined); // Simulate successful signin

    render(<SigninForm />);
    const submitButton = screen.getByRole("button", {
      name: "auth.signin.button.signIn",
    });

    fireEvent.submit(submitButton);

    await waitFor(() => {
      expect(mockSignin).toHaveBeenCalledWith({
        identifier: "testuser",
        password: "password123",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  test("handles signin error", async () => {
    mockUseFormValidation.mockReturnValue({
      values: { identifier: "testuser", password: "password123" },
      errors: {},
      isValid: true,
      handleChange: mockHandleChange,
    });
    const mockError = new Error("Signin failed");
    mockSignin.mockRejectedValue(mockError); // Simulate signin error
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {}); // Mock console.error

    render(<SigninForm />);
    const submitButton = screen.getByRole("button", {
      name: "auth.signin.button.signIn",
    });

    fireEvent.submit(submitButton);

    await waitFor(() => {
      expect(mockSignin).toHaveBeenCalledWith({
        identifier: "testuser",
        password: "password123",
      });
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error al iniciar sesión:",
        mockError
      );
      expect(mockNavigate).not.toHaveBeenCalled(); // Should not navigate on error
    });

    consoleErrorSpy.mockRestore(); // Restore console.error
  });
});
