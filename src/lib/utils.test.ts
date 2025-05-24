import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('should combine class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('should handle conditional class names', () => {
    expect(cn('class1', false, 'class3')).toBe('class1 class3');
  });

  it('should merge conflicting tailwind classes', () => {
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
  });

  it('should handle a mix of class names', () => {
    expect(cn('class1', 'bg-red-500', false, 'text-blue-500', 'bg-green-500')).toBe('class1 text-blue-500 bg-green-500');
  });

  it('should handle empty inputs', () => {
    expect(cn()).toBe('');
  });
});
