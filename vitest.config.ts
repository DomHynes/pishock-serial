import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,      // Optional: allows using describe/test without importing
        environment: 'node' // Use Node environment (default for backend projects)
    }
});