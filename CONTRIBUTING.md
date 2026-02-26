# Contributing to huntress-mcp

Thank you for your interest in contributing! This project is open source under the [Apache 2.0 License](LICENSE).

## How to Contribute

1. **Fork** the repository
2. **Create a branch** for your feature or fix: `git checkout -b feat/my-feature`
3. **Write tests** for any new functionality
4. **Ensure all tests pass**: `npm test`
5. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/): `feat: add new resource`, `fix: handle pagination edge case`
6. **Push** your branch and open a **Pull Request**

## Development Setup

```bash
git clone https://github.com/wyre-technology/huntress-mcp.git
cd huntress-mcp
npm install
npm test
npm run build
```

## Code Style

- TypeScript strict mode
- Zero production dependencies (native `fetch` only)
- All public APIs must have TypeScript types
- Tests use vitest + MSW

## Reporting Issues

Open an issue with a clear description, steps to reproduce, and expected vs actual behavior.

## License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0.

© WYRE Technology
