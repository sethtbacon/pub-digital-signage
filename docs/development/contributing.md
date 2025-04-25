# Contributing to Pub Digital Signage

Thank you for considering contributing to our Pub Digital Signage project! This document provides guidelines and instructions for contributing to make the process smooth for everyone involved.

## Development Environment Setup

### Prerequisites
- Node.js (version 16+)
- npm (version 8+)
- Git
- Docker and Docker Compose (recommended for consistent development)

### Setting Up Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pub-digital-signage.git
   cd pub-digital-signage
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Start the development environment**

   Using Docker (recommended):
   ```bash
   docker-compose up
   ```

   Without Docker:
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Database Admin: http://localhost:8081 (Docker only)

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
- Follow airbnb style guide
- Use const for variables that don't change
- Use let for variables that do change
- Use async/await for asynchronous operations

### Vue.js

- Use Vue 3 composition API
- Keep components small and focused
- Use props for component communication
- Use events for child-to-parent communication
- Use the store for shared state

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

## Documentation

- Document any new features or changes
- Update README.md if necessary
- Use JSDoc for API documentation

## Pull Request Process

1. Ensure your code follows our coding standards
2. Update documentation as needed
3. Add/update tests as needed
4. Get at least one approval from a team member
5. Respond to feedback and make necessary changes
6. Squash commits before merging if requested

## Questions?

If you have any questions or need help, please open an issue or reach out to the project maintainers.

Thank you for your contribution!