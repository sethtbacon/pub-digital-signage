# Contributing to Pub Digital Signage

Thank you for considering contributing to our Pub Digital Signage project! This document provides guidelines and instructions for contributing to make the process smooth for everyone involved.

## Development Environment Setup

### Prerequisites
- Node.js (version 16+)
- npm (version 8+)
- Git
- Docker and Docker Compose (recommended for consistent development)

## Development Workflow

### Getting Started

For the best development experience, we recommend:

1. **Clone and setup the project**
   ```bash
   git clone https://github.com/yourusername/pub-digital-signage.git
   cd pub-digital-signage
   npm run setup:dev
   ```

2. **Start development servers**
   ```bash
   # For JavaScript development
   npm run dev
   
   # For TypeScript development
   npm run dev:ts
   ```

### Development Scripts

We provide several scripts to streamline development:

#### Setup Scripts

- `npm run setup:dev` - Quick setup for development (install dependencies and initialize database)
- `npm run setup` - Full setup including build process (for production)

#### Database Scripts

- `npm run db:init` - Initialize database with schema
- `npm run db:seed` - Populate database with sample data for testing

#### TypeScript Development

- `npm run dev:ts` - Run both frontend and backend with TypeScript support
- `npm run dev:backend:ts` - Run only backend with TypeScript support
- `npm run type-check` - Run TypeScript type checking
- `npm run type-check:watch` - Run TypeScript type checking in watch mode

#### Debugging

- `npm run dev:debug` - Run JavaScript with debugging enabled
- `npm run dev:ts:debug` - Run TypeScript with debugging enabled

#### Testing

- `npm run test` - Run all tests
- `npm run test:frontend` - Run only frontend tests
- `npm run test:backend` - Run only backend tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

#### Building

- `npm run build` - Build both frontend and backend
- `npm run build:frontend` - Build only frontend
- `npm run build:backend` - Build only backend

### Docker Development

If you prefer to use Docker for development:

1. Start the development environment:
   ```bash
   docker-compose up
   ```

2. For running tests in Docker:
   ```bash
   docker-compose --profile testing up test-runner
   ```

3. To rebuild containers after dependency changes:
   ```bash
   docker-compose up --build
   ```

### Workflow Best Practices

1. **Branch Management**
   - Create feature branches from `main`
   - Use descriptive branch names (`feature/leaderboard-sorting`, `bugfix/theme-switching`)
   - Keep branches focused on a single feature or fix

2. **Development Cycle**
   - Write tests first when possible
   - Implement feature or fix
   - Ensure code passes linting and type checking
   - Verify all tests pass
   - Submit pull request

3. **Continuous Integration**
   - All pull requests will be automatically tested
   - Code quality checks must pass before merging
   - Build verification ensures the application can be built successfully

## TypeScript

The project uses TypeScript for type safety across both frontend and backend. This helps catch errors at compile time and improves code quality.

### TypeScript Structure

- Root `/tsconfig.json`: Base configuration with shared settings
- `/src/frontend/tsconfig.json`: Vue-specific TypeScript configuration 
- `/src/backend/tsconfig.json`: Node/Express-specific configuration
- `/src/shared/types/`: Shared type definitions used by both frontend and backend

### Working with Types

1. **Common Types**
   - Define shared interfaces and types in `/src/shared/types/`
   - Use imports from the shared types in both frontend and backend

2. **Type Checking**
   ```bash
   # Run type checking across the entire project
   npm run type-check
   
   # Run type checking for frontend only
   npm run type-check:frontend
   
   # Run type checking for backend only
   npm run type-check:backend
   ```

3. **Type Guidelines**
   - Always define return types for functions
   - Use interfaces for object structures
   - Use type annotation for variables when not obvious
   - Create meaningful and descriptive type names

## Code Style and Linting

### ESLint and Prettier

The project uses ESLint and Prettier to enforce consistent code style. The configuration is already set up in the repository.

#### Using the Linting Tools

From the project root, you can run:

```bash
# Check for linting issues across both frontend and backend
npm run lint

# Automatically fix linting issues where possible
npm run lint:fix

# Format all code files with Prettier
npm run format
```

You can also run these commands specifically for frontend or backend:

```bash
# Frontend only
npm run lint:frontend
npm run lint:fix:frontend
npm run format:frontend

# Backend only
npm run lint:backend
npm run lint:fix:backend
npm run format:backend
```

#### Key Style Rules

- **Indentation**: 2 spaces
- **Quotes**: Single quotes
- **Semicolons**: Required
- **Line Length**: 100 characters maximum
- **Trailing Commas**: ES5 style trailing commas
- **Arrow Functions**: Avoid parentheses around single parameters
- **End of Line**: LF (Unix-style line endings)

#### Editor Integration

For the best development experience, configure your editor to use ESLint and Prettier:

**VS Code**:
1. Install the "ESLint" and "Prettier - Code formatter" extensions
2. Enable "Format on Save" in your settings
3. Set Prettier as the default formatter

**WebStorm/IntelliJ IDEA**:
1. Enable ESLint in Preferences → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint
2. Enable Prettier in Preferences → Languages & Frameworks → JavaScript → Prettier

## Code Structure

### Frontend Architecture (Vue.js)

The frontend is organized into:
- **Components**: Reusable UI components
- **Views**: Page-level components
- **Store**: State management (Pinia)
- **Router**: Navigation and routing
- **Services**: API clients and external services

When adding new features:
- Place shared UI elements in `src/frontend/components/common`
- Add new pages in `src/frontend/views`
- Add new state management in `src/frontend/store/modules`
- External integrations go in `src/frontend/services`

### Backend Architecture (Express)

The backend follows a layered architecture:
- **API Routes**: Define endpoints in `src/backend/api/routes`
- **Controllers**: Handle request/response in `src/backend/api/controllers`
- **Services**: Business logic in `src/backend/services`
- **Models**: Database interactions in `src/backend/db/models`

## Coding Standards

### General

- Use meaningful variable and function names
- Write comments for complex logic
- Follow the DRY (Don't Repeat Yourself) principle
- Keep functions small and focused on a single task

### JavaScript/TypeScript

- Use ES6+ features
- Follow airbnb style guide for the backend
- Use Vue style guide for the frontend
- Use const for variables that don't change
- Use let for variables that do change
- Use async/await for asynchronous operations

### Vue.js

- Use Vue 3 composition API
- Keep components small and focused
- Use props for component communication
- Use events for child-to-parent communication
- Use the store for shared state
- Follow Vue.js naming conventions:
  - Components should use multi-word names (e.g., `GameLeaderboard.vue`)
  - Props should use camelCase in JavaScript and kebab-case in templates

### CSS/SCSS

- Use SCSS for styling
- Follow BEM naming convention
- Use variables for colors, spacing, etc.
- Make components responsive
- Test on different screen sizes

## Git Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Add tests for your changes
   - Ensure all tests pass
   - Run linting and formatting before committing:
     ```bash
     npm run lint:fix
     npm run format
     ```

3. **Commit your changes**
   ```bash
   git commit -m "Add feature: your feature description"
   ```

   Use prefixes for your commit messages:
   - `Add: ` for new features
   - `Fix: ` for bug fixes
   - `Update: ` for updates to existing features
   - `Refactor: ` for code refactoring
   - `Test: ` for adding tests
   - `Docs: ` for documentation changes

4. **Push your changes**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a pull request**
   - Describe your changes
   - Reference any related issues
   - Request reviews from team members

## Testing

Run tests to ensure your changes don't break existing functionality:

```bash
npm test
```

### Testing Guidelines
- Write unit tests for utility functions and components
- Write integration tests for API endpoints
- Test edge cases and error handling

### Testing Approach

Our Vue.js frontend uses the following testing stack:
- Vitest as the test runner and assertion library
- Vue Test Utils for mounting and interacting with Vue components
- Pinia Test Utils for testing stores

#### Component Testing Pattern

When testing Vue components, follow this general pattern:

1. **Setup** - Mount the component with any required props, plugins, and mocks
2. **Assertion** - Verify the component renders correctly and functions as expected
3. **Interaction** - Simulate user actions like clicks, input changes
4. **Verification** - Validate that the component state and output match expectations

Example:

```javascript
// Example component test
it('updates counter when button is clicked', async () => {
  // Setup
  const wrapper = mount(Counter);
  
  // Initial assertion
  expect(wrapper.text()).toContain('Count: 0');
  
  // Interaction
  await wrapper.find('button').trigger('click');
  
  // Verification
  expect(wrapper.text()).toContain('Count: 1');
});
```

#### Store Testing Pattern

For Pinia stores, follow this approach:

1. **Setup** - Create a fresh Pinia instance for each test
2. **Action Testing** - Test actions by calling them and verifying state changes
3. **Getter Testing** - Verify getters return expected values for given state
4. **Mocking** - Mock external dependencies like API calls

Example:

```javascript
// Example store test
it('fetches data and updates state', async () => {
  // Setup mock API response
  vi.spyOn(api, 'getData').mockResolvedValue([{ id: 1, name: 'Item 1' }]);
  
  // Call action
  await store.fetchData();
  
  // Verify state was updated correctly
  expect(store.items.length).toBe(1);
  expect(store.items[0].name).toBe('Item 1');
});
```

#### Router Testing

When testing components that use Vue Router:

1. Mock the router with `vi.mock('vue-router')`
2. Provide the necessary router functions like `useRoute` and `useRouter`
3. Test navigation guard behavior separately

#### File Structure

Organize tests to mirror the source code structure:

```
/tests
  /unit
    /components
      /common
      /layout
      /widgets
    /store
      /modules
    /services
    /views
  /integration
```

Remember to run the test suite before submitting a pull request:

```bash
# Run all tests
npm run test

# Run only frontend tests
npm run test:frontend

# Run with coverage report
npm run test:coverage
```

## Questions?

If you have any questions or need help, please open an issue or reach out to the project maintainers.

Thank you for your contribution!