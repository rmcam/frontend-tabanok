import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock URL.createObjectURL for tests
global.URL.createObjectURL = vi.fn((file: File | Blob) => {
  if (file instanceof File) {
    return `mock-url:${file.name}`;
  }
  // Handle Blob without name if necessary, or return a generic URL
  return `mock-url:blob`;
});
global.URL.revokeObjectURL = vi.fn();

console.log('Setup file executed!');
