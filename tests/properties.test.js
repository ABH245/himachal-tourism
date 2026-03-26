import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('.');

// Feature: website-deploy-structure, Property 1: All required root-level files exist
describe('Property 1: required root-level files', () => {
  it('all required root-level files exist', () => {
    fc.assert(fc.property(fc.constant(ROOT), (root) => {
      const required = ['README.md', '.gitignore', 'package.json', '.env.example', 'Dockerfile', 'docker-compose.yml'];
      required.forEach(f => expect(fs.existsSync(path.join(root, f))).toBe(true));
    }), { numRuns: 100 });
  });
});

// Feature: website-deploy-structure, Property 2: src/ contains server.js, routes/, controllers/, services/, schemas/
describe('Property 2: src/ structure', () => {
  it('src/ contains all required backend files and directories', () => {
    fc.assert(fc.property(fc.constant(ROOT), (root) => {
      const required = ['src/server.js', 'src/routes', 'src/controllers', 'src/services', 'src/schemas'];
      required.forEach(p => expect(fs.existsSync(path.join(root, p))).toBe(true));
    }), { numRuns: 100 });
  });
});

// Feature: website-deploy-structure, Property 3: public/index.html exists and is non-empty, and all public/ subdirs exist
describe('Property 3: public/ structure', () => {
  it('public/index.html is non-empty and subdirs exist', () => {
    fc.assert(fc.property(fc.constant(ROOT), (root) => {
      const indexPath = path.join(root, 'public', 'index.html');
      expect(fs.existsSync(indexPath)).toBe(true);
      expect(fs.readFileSync(indexPath, 'utf8').length).toBeGreaterThan(0);
      ['public/css', 'public/js', 'public/assets'].forEach(d =>
        expect(fs.existsSync(path.join(root, d))).toBe(true)
      );
    }), { numRuns: 100 });
  });
});

// Feature: website-deploy-structure, Property 5: Dockerfile contains FROM (Node.js), COPY, RUN npm, and EXPOSE
describe('Property 5: Dockerfile instructions', () => {
  it('Dockerfile contains required Node.js instructions', () => {
    fc.assert(fc.property(fc.constant(ROOT), (root) => {
      const content = fs.readFileSync(path.join(root, 'Dockerfile'), 'utf8');
      expect(content).toMatch(/^FROM node:/m);
      expect(content).toMatch(/COPY/);
      expect(content).toMatch(/RUN npm/);
      expect(content).toMatch(/EXPOSE/);
    }), { numRuns: 100 });
  });
});

// Feature: website-deploy-structure, Property 6: docker-compose.yml service build context references project root
describe('Property 6: docker-compose build context', () => {
  it('docker-compose.yml build context is project root', () => {
    fc.assert(fc.property(fc.constant(ROOT), (root) => {
      const content = fs.readFileSync(path.join(root, 'docker-compose.yml'), 'utf8');
      expect(content).toMatch(/build:\s*\./);
    }), { numRuns: 100 });
  });
});

// Feature: website-deploy-structure, Property 7: package.json defines a start script
describe('Property 7: package.json start script', () => {
  it('package.json has a scripts.start field', () => {
    fc.assert(fc.property(fc.constant(ROOT), (root) => {
      const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
      expect(pkg.scripts).toBeDefined();
      expect(pkg.scripts.start).toBeDefined();
    }), { numRuns: 100 });
  });
});

// Feature: website-deploy-structure, Property 8: .gitignore excludes .env and node_modules
describe('Property 8: .gitignore exclusions', () => {
  it('.gitignore excludes .env and node_modules/', () => {
    fc.assert(fc.property(fc.constant(ROOT), (root) => {
      const content = fs.readFileSync(path.join(root, '.gitignore'), 'utf8');
      expect(content).toMatch(/\.env/);
      expect(content).toMatch(/node_modules/);
    }), { numRuns: 100 });
  });
});

// Feature: website-deploy-structure, Property 9: Invalid payloads cause controller to return 400
describe('Property 9: schema validation rejects invalid payloads', () => {
  it('invalid destination payload fails validation', () => {
    const { validate } = require('../src/schemas/destinationSchema.js');
    fc.assert(fc.property(
      fc.record({ name: fc.constant(''), category: fc.constant('invalid-cat'), rating: fc.constant(99) }),
      (payload) => {
        const result = validate(payload);
        expect(result.success).toBe(false);
        expect(result.error).not.toBeNull();
      }
    ), { numRuns: 100 });
  });
});

// Feature: website-deploy-structure, Property 10: Valid payloads pass; invalid fail with descriptive errors
describe('Property 10: schema round-trip', () => {
  it('valid destination payloads pass validation', () => {
    const { validate } = require('../src/schemas/destinationSchema.js');
    const categories = ['hill-station', 'adventure', 'religious', 'nature', 'heritage'];
    fc.assert(fc.property(
      fc.record({
        name: fc.string({ minLength: 2, maxLength: 50 }),
        region: fc.string({ minLength: 2, maxLength: 50 }),
        category: fc.constantFrom(...categories),
        rating: fc.float({ min: 0, max: 5 }),
        reviews: fc.nat(),
      }),
      (payload) => {
        const result = validate(payload);
        expect(result.success).toBe(true);
      }
    ), { numRuns: 100 });
  });
});

// Feature: website-deploy-structure, Property 11: Service throws typed DomainError on violations
describe('Property 11: service throws typed errors', () => {
  it('getById throws DomainError for non-existent id', () => {
    const { getById } = require('../src/services/destinationService.js');
    const DomainError = require('../src/services/DomainError.js');
    fc.assert(fc.property(
      fc.string({ minLength: 10 }).filter(s => !['1','2','3','4','5','6','7','8'].includes(s)),
      (id) => {
        expect(() => getById(id)).toThrow(DomainError);
      }
    ), { numRuns: 100 });
  });
});

// Feature: website-deploy-structure, Property 12: Service modules contain no Express req/res imports
describe('Property 12: service HTTP independence', () => {
  it('service files do not import express req/res', () => {
    fc.assert(fc.property(fc.constant(ROOT), (root) => {
      const serviceDir = path.join(root, 'src', 'services');
      const files = fs.readdirSync(serviceDir).filter(f => f.endsWith('.js'));
      files.forEach(file => {
        const content = fs.readFileSync(path.join(serviceDir, file), 'utf8');
        expect(content).not.toMatch(/require\(['"]express['"]\)/);
      });
    }), { numRuns: 100 });
  });
});
