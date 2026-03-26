# Requirements Document

## Introduction

This feature defines the folder structure required to deploy a full web application. The structure must support a Node.js/Express backend with routes, controllers, services, and schemas, alongside static asset serving for the frontend, and containerized deployment via Docker.

## Glossary

- **Website**: A collection of files served over HTTP/HTTPS to end users via a browser.
- **Deploy_Structure**: The minimum set of directories and files required to successfully deploy a website to a hosting platform.
- **Entry_Point**: The primary HTML file (typically `index.html`) that a web server serves when a root URL is requested.
- **Static_Assets**: Files such as CSS, JavaScript, images, and fonts referenced by the Entry_Point.
- **Public_Dir**: The directory exposed to the web server and served directly to clients.
- **Config_File**: A deployment configuration file (e.g., hosting platform config) that defines routing, redirects, and build output settings.
- **Build_Output**: The directory containing compiled or processed files ready for deployment.
- **Backend_Server**: The Node.js/Express application that handles HTTP requests, applies middleware, and delegates to the Router layer.
- **Router**: The layer responsible for mapping incoming HTTP method and URL path combinations to the appropriate Controller handler.
- **Controller**: The request/response handler that extracts input from the HTTP request, invokes the Service layer, and returns an HTTP response.
- **Service**: The business logic layer that performs operations, enforces rules, and coordinates data access independently of HTTP concerns.
- **Schema**: A data validation and shape definition used to validate request payloads and define data models.
- **Server_Dir**: The top-level directory containing all backend source code (`src/`).

## Requirements

### Requirement 1: Entry Point File

**User Story:** As a developer, I want a root entry point file, so that the web server can resolve and serve the website when a user visits the root URL.

#### Acceptance Criteria

1. THE Deploy_Structure SHALL include an `index.html` file at the root of the Public_Dir.
2. WHEN a web server receives a request for the root URL, THE Entry_Point SHALL be served as the default response.
3. IF the `index.html` file is absent from the Public_Dir, THEN THE Deploy_Structure SHALL be considered invalid for deployment.

---

### Requirement 2: Static Assets Organization

**User Story:** As a developer, I want a predictable folder layout for static assets, so that the Entry_Point can reference them with consistent relative paths.

#### Acceptance Criteria

1. THE Deploy_Structure SHALL include a `css/` subdirectory inside the Public_Dir for stylesheet files.
2. THE Deploy_Structure SHALL include a `js/` subdirectory inside the Public_Dir for JavaScript files.
3. THE Deploy_Structure SHALL include an `assets/` subdirectory inside the Public_Dir for images, fonts, and other binary resources.
4. WHEN the Entry_Point references a static asset, THE Static_Assets SHALL be resolvable via relative paths from the Public_Dir root.

---

### Requirement 3: Deployment Configuration

**User Story:** As a developer, I want a deployment configuration file, so that the hosting platform knows how to route requests and locate the Build_Output.

#### Acceptance Criteria

1. THE Deploy_Structure SHALL include a Config_File at the project root that specifies the Public_Dir as the build output directory.
2. WHEN the hosting platform reads the Config_File, THE Config_File SHALL define the root directory to serve as the Public_Dir.
3. IF the Config_File is absent, THEN THE Deploy_Structure SHALL fall back to serving files from the project root.

---

### Requirement 4: Project Root Metadata

**User Story:** As a developer, I want standard project metadata files at the root, so that the project is recognizable and manageable by common developer tooling.

#### Acceptance Criteria

1. THE Deploy_Structure SHALL include a `README.md` file at the project root describing the project purpose and deployment steps.
2. THE Deploy_Structure SHALL include a `.gitignore` file at the project root excluding build artifacts and environment-specific files from version control.
3. WHERE a package manager is used, THE Deploy_Structure SHALL include a `package.json` file at the project root defining project metadata and scripts.

---

### Requirement 5: Dockerfile

**User Story:** As a developer, I want a Dockerfile in the project, so that the website can be built and served inside a container for consistent, portable deployments.

#### Acceptance Criteria

1. THE Deploy_Structure SHALL include a `Dockerfile` at the project root that defines the steps to build and serve the website.
2. WHEN the `Dockerfile` is built, THE Dockerfile SHALL produce an image that serves the Public_Dir via an HTTP server on a defined port.
3. IF the `Dockerfile` is absent, THEN THE Deploy_Structure SHALL be considered incomplete for container-based deployment.
4. THE Dockerfile SHALL specify a base image, copy the Public_Dir contents into the image, and expose the HTTP port.

---

### Requirement 6: Docker Compose Configuration

**User Story:** As a developer, I want a `docker-compose.yml` file, so that the website container can be started with a single command and port mappings are defined declaratively.

#### Acceptance Criteria

1. THE Deploy_Structure SHALL include a `docker-compose.yml` file at the project root that defines the website service.
2. WHEN `docker compose up` is executed, THE Deploy_Structure SHALL start the website container and map the container's HTTP port to a host port.
3. THE `docker-compose.yml` SHALL reference the `Dockerfile` as the build context for the website service.
4. IF the `docker-compose.yml` is absent, THEN THE Deploy_Structure SHALL be considered incomplete for multi-container or orchestrated deployment workflows.

---

### Requirement 7: Backend Server Entry Point

**User Story:** As a developer, I want a backend server entry point, so that the application can be started with a single command and all middleware, routes, and error handlers are registered in one place.

#### Acceptance Criteria

1. THE Deploy_Structure SHALL include a `src/server.js` (or `src/index.js`) file at the Server_Dir root that initialises the Backend_Server and begins listening on a configurable port.
2. WHEN the Backend_Server starts, THE Backend_Server SHALL register all Routers, apply middleware (e.g., JSON body parsing, CORS), and attach error-handling middleware before accepting connections.
3. IF the port environment variable is absent, THEN THE Backend_Server SHALL fall back to a default port value defined in the source.
4. THE Backend_Server SHALL serve the Public_Dir static files so that the frontend is accessible from the same origin as the API.

---

### Requirement 8: Routes Layer

**User Story:** As a developer, I want a dedicated routes directory, so that URL-to-handler mappings are declared separately from business logic and are easy to audit.

#### Acceptance Criteria

1. THE Deploy_Structure SHALL include a `src/routes/` directory containing one route module per resource or feature domain.
2. WHEN the Backend_Server initialises, THE Router SHALL mount each route module under a versioned or named URL prefix (e.g., `/api/`).
3. THE Router SHALL delegate each matched request to the corresponding Controller handler without containing business logic.
4. IF a request path does not match any registered route, THEN THE Router SHALL pass the request to a 404 handler that returns a structured error response.

---

### Requirement 9: Controllers Layer

**User Story:** As a developer, I want a controllers directory, so that HTTP request/response handling is isolated from business logic and remains independently testable.

#### Acceptance Criteria

1. THE Deploy_Structure SHALL include a `src/controllers/` directory containing one controller module per resource or feature domain.
2. WHEN a Controller receives a request, THE Controller SHALL extract and validate input parameters before invoking the Service layer.
3. WHEN the Service layer returns a result, THE Controller SHALL map the result to an appropriate HTTP status code and response body.
4. IF the Service layer throws an error, THEN THE Controller SHALL pass the error to the next error-handling middleware rather than handling it inline.
5. THE Controller SHALL not contain business logic or direct data-access calls.

---

### Requirement 10: Services Layer

**User Story:** As a developer, I want a services directory, so that business logic is centralised, reusable across controllers, and testable without an HTTP context.

#### Acceptance Criteria

1. THE Deploy_Structure SHALL include a `src/services/` directory containing one service module per resource or feature domain.
2. THE Service SHALL encapsulate all business rules and orchestration logic for its domain.
3. WHEN a Service method is called, THE Service SHALL validate domain invariants before performing any state-changing operation.
4. THE Service SHALL not import or reference HTTP request/response objects.
5. IF a Service operation fails due to a domain rule violation, THEN THE Service SHALL throw a typed error that the Controller can map to an HTTP response.

---

### Requirement 11: Schemas Layer

**User Story:** As a developer, I want a schemas directory, so that request payload shapes and data models are defined in one place and reused across controllers and services.

#### Acceptance Criteria

1. THE Deploy_Structure SHALL include a `src/schemas/` directory containing one schema module per resource or feature domain.
2. WHEN a Controller receives a request body, THE Schema SHALL be used to validate the payload before the Controller invokes the Service layer.
3. IF a request payload fails Schema validation, THEN THE Controller SHALL return a 400 response containing the validation error details without invoking the Service layer.
4. THE Schema SHALL define the expected field names, types, and constraints for each data model used by the application.
5. WHERE a database ORM or ODM is used, THE Schema SHALL serve as the single source of truth for both validation and the data model definition.

---

### Requirement 12: Backend Project Configuration

**User Story:** As a developer, I want backend configuration and dependency files at the project root, so that the server can be installed and started with standard tooling.

#### Acceptance Criteria

1. THE Deploy_Structure SHALL include a `package.json` at the project root listing all backend runtime dependencies and defining a `start` script that launches the Backend_Server.
2. THE Deploy_Structure SHALL include a `.env.example` file at the project root documenting all required environment variables without exposing secret values.
3. THE `.gitignore` SHALL exclude the `.env` file and `node_modules/` directory from version control.
4. WHERE a linter or formatter is configured, THE Deploy_Structure SHALL include the corresponding config file (e.g., `.eslintrc`, `.prettierrc`) at the project root.
