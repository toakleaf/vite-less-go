# Vite + React with less.go

This project demonstrates using [less.go](https://github.com/toakleaf/less.go) as the LESS preprocessor for a Vite React application, instead of Vite's built-in LESS support.

## What is less.go?

less.go is a complete Go port of Less.js, providing 100% feature parity with Less.js v4.2.2 while offering the performance benefits of a native Go binary. It's approximately 2.2x faster than Less.js.

## Setup

### Prerequisites

- **Node.js** >= 14

### Installation

1. Install project dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## How It Works

This project uses a custom Vite plugin (`vite-plugin-lessgo.js`) that:

1. Intercepts `.less` file imports before Vite's built-in CSS handling
2. Compiles the LESS files using the `lessgo` Node.js API
3. Returns the compiled CSS to Vite for processing

The plugin uses the `lessgo` npm package which includes pre-built binaries for all major platforms (macOS, Linux, Windows on x64 and arm64).

## Plugin Options

The plugin accepts the following options:

```javascript
import lessgo from './vite-plugin-lessgo.js'

export default defineConfig({
  plugins: [
    lessgo({
      compress: false,           // Minify CSS output
      paths: ['./src/styles'],   // Additional include paths for @import
      globalVars: {              // Global variables (injected before parsing)
        primaryColor: '#646cff',
      },
      modifyVars: {              // Modify variables (override after parsing)
        logoHeight: '8em',
      },
      plugins: [                 // LESS plugins
        'clean-css',             // String shorthand
        { name: 'autoprefix', options: 'browsers: last 2 versions' },
      ],
    }),
    react(),
  ],
})
```

Note: LESS plugins are npm packages. Install them separately:
```bash
npm install -D less-plugin-clean-css less-plugin-autoprefix
```

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
