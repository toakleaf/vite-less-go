# Vite + React with less.go

This project demonstrates using [less.go](https://github.com/toakleaf/less.go) as the LESS preprocessor for a Vite React application, instead of Vite's built-in LESS support.

## What is less.go?

less.go is a complete Go port of Less.js, providing 100% feature parity with Less.js v4.2.2 while offering the performance benefits of a native Go binary. It's approximately 2.2x faster than Less.js.

## Setup

### Prerequisites

1. **Go** (for installing the less.go binary)
2. **Node.js** >= 14

### Installation

1. Install the less.go compiler:

```bash
go install github.com/toakleaf/less.go/cmd/lessc-go@latest
```

2. Install project dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## How It Works

This project uses a custom Vite plugin (`vite-plugin-lessgo.js`) that:

1. Intercepts `.less` file imports before Vite's built-in CSS handling
2. Compiles the LESS files using the `lessc-go` binary
3. Returns the compiled CSS to Vite for processing

The plugin automatically finds the `lessc-go` binary in:
- `~/go/bin/lessc-go` (standard Go installation path)
- `node_modules/@lessgo/{platform}-{arch}/bin/lessc-go` (npm package, when binaries are available)
- System PATH

## Current Limitations

As of December 2024, less.go is still in active development. The following CLI features are not yet implemented:

- `--stdin` flag for reading LESS content from standard input
- `--include-path` for specifying import paths
- `--compress` for minified output
- `--source-map` for source map generation

The npm package (`lessgo`) currently contains placeholder packages without the actual binaries. You must install `lessc-go` via Go as shown above.

### What less.go Needs for Full Vite Integration

For seamless Vite integration, less.go would benefit from:

1. **stdin support**: Allow reading LESS content from stdin (`--stdin` or `-` argument) to avoid temp file overhead
2. **Include paths**: Support `--include-path` for resolving `@import` statements
3. **Published binaries**: Release pre-built binaries in the npm packages for each platform
4. **Compression flag**: Support `--compress` for minified output
5. **Source maps**: Support `--source-map` for debugging

## Project Structure

```
.
├── src/
│   ├── App.jsx           # Main React component
│   ├── App.less          # Component styles (LESS)
│   ├── index.less        # Global styles (LESS)
│   └── main.jsx          # Entry point
├── vite-plugin-lessgo.js # Custom Vite plugin for less.go
├── vite.config.js        # Vite configuration
└── package.json
```

## LESS Features Used

The LESS files in this project demonstrate:

- **Variables**: `@primary-color`, `@font-family`, etc.
- **Nesting**: `&:hover`, `&.react`, etc.
- **Comments**: Both `//` line comments and `/* */` block comments

## References

- [less.go repository](https://github.com/toakleaf/less.go)
- [Vite documentation](https://vite.dev)
- [LESS language reference](https://lesscss.org)
