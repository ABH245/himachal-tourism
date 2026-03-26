# Implementation Plan: website-deploy-structure

## Overview

Scaffold a full-stack Node.js/Express project with a layered backend architecture, static frontend, Docker support, and property-based tests using fast-check for all 12 correctness properties.

## Tasks

- [x] 1. Initialize project root configuration files
  - Create `package.json` with `name`, `version`, `scripts.start` (`node src/server.js`), and Express/Zod/CORS dependencies listed
  - Create `.env.example` documenting `PORT` and `NODE_ENV` without secret values
  - Create `.gitignore` excluding `.env`, `node_modules/`, and build artifacts
  - Create `README.md` with project description, setup steps, and deployment instructions
  - _Requirements: 4.1, 4.2, 4.3, 12.1, 12.2, 12.3_

  - [-]* 1.1 Write property test for root-level files (Property 1)
    - **Property 1: All required root-level files exist**
    - **Validates: Requirements 4.1, 4.2, 4.3, 5.1, 6.1, 12.1, 12.2**

  - [-]* 1.2 Write property test for package.json start script (Property 7)
    - **Property 7: package.json defines a start script**
    - **Validates: Requirements 12.1**

  - [-]* 1.3 Write property test for .gitignore exclusions (Property 8)
    - **Property 8: .gitignore excludes .env and node_modules**
    - **Validates: Requirements 12.3**

- [x] 2. Create frontend public/ directory and entry point
  - Create `public/index.html` as a non-empty HTML5 document referencing `css/`, `js/`, and `assets/` via root-relative paths
  - Create `public/css/.gitkeep`, `public/js/.gitkeep`, `public/assets/.gitkeep` to preserve empty directories
  - _Requirements: 1.1, 1.3, 2.1, 2.2, 2.3, 2.4_

  - [ ]* 2.1 Write property test for public/ structure (Property 3)
    - **Property 3: public/index.html exists and is non-empty, and all public/ subdirs exist**
    - **Validates: Requirements 1.1, 1.3, 2.1, 2.2, 2.3**

  - [ ]* 2.2 Write property test for asset reference resolution (Property 4)
    - **Property 4: Asset references in index.html resolve under public/**
    - **Validates: Requirements 2.4**

- [x] 3. Create schemas layer
  - Create `src/schemas/exampleSchema.js` using Zod to define field names, types, and constraints for an example resource
  - Export a `validate(payload)` function that returns `{ success, data, error }` without throwing
  - _Requirements: 11.1, 11.2, 11.4_

  - [ ]* 3.1 Write property test for schema round-trip validation (Property 10)
    - **Property 10: Valid payloads pass schema validation; invalid payloads fail with descriptive errors**
    - **Validates: Requirements 11.4**

- [x] 4. Create services layer
  - Create `src/services/exampleService.js` with business logic functions that validate domain invariants and throw a typed `DomainError` class on violations
  - Define and export the `DomainError` class (extends `Error`, includes `statusCode` field)
  - Service functions MUST NOT import or reference Express `req`, `res`, or `next`
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ]* 4.1 Write property test for typed service errors (Property 11)
    - **Property 11: Service throws typed errors on domain violations before state changes**
    - **Validates: Requirements 10.3, 10.5**

  - [ ]* 4.2 Write property test for service HTTP independence (Property 12)
    - **Property 12: Service modules contain no imports of Express req/res objects**
    - **Validates: Requirements 10.4**

- [x] 5. Create controllers layer
  - Create `src/controllers/exampleController.js` that extracts input from `req.params`/`req.query`/`req.body`, validates via schema, calls the service, maps results to HTTP responses, and calls `next(error)` on any thrown error
  - Controllers MUST NOT contain business logic or data-access calls
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [ ]* 5.1 Write property test for schema validation → 400 response (Property 9)
    - **Property 9: Invalid payloads cause controller to return 400 without invoking the service**
    - **Validates: Requirements 11.3, 9.2**

- [x] 6. Create routes layer
  - Create `src/routes/index.js` that instantiates an Express `Router`, mounts example resource routes under `/api/`, delegates to controller handlers, and adds a catch-all 404 handler returning `{ error: "Not Found", path }`
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 7. Create backend server entry point
  - Create `src/server.js` that initializes Express, applies JSON body-parsing and CORS middleware, mounts `express.static('public')`, registers the routes module under `/api/`, attaches a global error-handling middleware, and listens on `process.env.PORT || 3000`
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 8. Checkpoint — wire backend layers together and verify
  - Ensure `src/server.js` correctly imports routes, which import controllers, which import schemas and services
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Create Dockerfile
  - Create `Dockerfile` at project root using `node:lts-alpine` base image with `WORKDIR /app`, `COPY package*.json`, `RUN npm ci --omit=dev`, `COPY . .`, `EXPOSE 3000`, `CMD ["node", "src/server.js"]`
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ]* 9.1 Write property test for Dockerfile instructions (Property 5)
    - **Property 5: Dockerfile contains FROM (Node.js), COPY, RUN npm, and EXPOSE instructions**
    - **Validates: Requirements 5.4**

- [x] 10. Create docker-compose.yml
  - Create `docker-compose.yml` at project root defining an `app` service with `build: .`, port mapping `3000:3000`, and `env_file: .env`
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ]* 10.1 Write property test for docker-compose build context (Property 6)
    - **Property 6: docker-compose.yml service build context references the project root**
    - **Validates: Requirements 6.3**

- [x] 11. Set up test infrastructure and wire all property tests
  - Install `fast-check` and a test runner (Jest or Vitest) as dev dependencies in `package.json`
  - Create `tests/properties.test.js` (or `.spec.js`) containing all 12 property-based tests, each tagged with `// Feature: website-deploy-structure, Property <N>: <property_text>` and running a minimum of 100 iterations
  - _Requirements: all_

  - [ ]* 11.1 Write property test for src/ structure (Property 2)
    - **Property 2: src/ contains server.js, routes/, controllers/, services/, schemas/**
    - **Validates: Requirements 7.1, 8.1, 9.1, 10.1, 11.1**

- [x] 12. Final checkpoint — ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests use `fast-check` with a minimum of 100 iterations each
- All 12 correctness properties from the design document are covered by property sub-tasks
- The service layer must never reference Express objects — enforced by Property 12
