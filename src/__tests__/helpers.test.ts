import { describe, it, expect } from 'vitest';
import { clearStackTrace } from '../helpers';

describe('clearStackTrace', () => {
  it('should return the same error object', () => {
    const error = new Error('test error');
    const result = clearStackTrace(error, clearStackTrace);
    expect(result).toBe(error);
  });

  it('should modify the stack trace (removing internal frames)', () => {
    function outerFunction() {
      const error = new Error('test error');
      const originalStack = error.stack;
      clearStackTrace(error, outerFunction);
      // After clearing, the stack should be different (internal frames removed)
      // In Node.js, captureStackTrace is available and will modify the stack
      if (Error.captureStackTrace) {
        expect(error.stack).not.toBe(originalStack);
      }
      return error;
    }

    const error = outerFunction();
    // The stack should not contain 'outerFunction' since we cleared from that point
    if (Error.captureStackTrace) {
      expect(error.stack).not.toContain('outerFunction');
    }
  });

  it('should handle non-Error values gracefully', () => {
    const nonError = { message: 'not a real error' };
    const result = clearStackTrace(nonError, clearStackTrace);
    expect(result).toBe(nonError);
  });
});
