# Lessgo vs Less.js Benchmark

This project benchmarks the performance difference between [lessgo](https://github.com/toakleaf/lessgo) (a Go-based LESS compiler) and the standard JavaScript-based [less.js](https://lesscss.org/) when used with Vite.

## Overview

The benchmark compares build times for a React SPA ("PawSpace") containing:
- **40 unique LESS files** - Each with custom themes, animations, and complex styling
- **~500 lines of shared LESS variables and mixins**
- **Complex CSS features** - Gradients, keyframe animations, pseudo-elements, nested selectors

## Running the Benchmark

```bash
# Install dependencies
npm install

# Run the full benchmark (5 iterations each)
npm run benchmark
```

## Individual Builds

```bash
# Build with lessgo (@lessgo/plugin-vite)
npm run build

# Build with less.js (Vite built-in)
npm run build:lessjs
```

## How It Works

The benchmark script (`benchmark.js`) performs the following:

1. **Runs 5 builds** using lessgo (`vite.config.js`)
2. **Runs 5 builds** using less.js (`vite.config.lessjs.js`)
3. **Cleans the dist folder** between each run to ensure cold builds
4. **Calculates statistics** - min, max, average, and median build times
5. **Compares output sizes** of the final builds

## Configuration Files

| File | Description |
|------|-------------|
| `vite.config.js` | Uses `@lessgo/plugin-vite` for LESS compilation |
| `vite.config.lessjs.js` | Uses Vite's built-in less.js preprocessor |
| `benchmark.js` | Orchestrates the benchmark runs and reports results |

## Sample Results

```
============================================================
LESSGO vs LESS.JS VITE BUILD BENCHMARK
============================================================

Running 5 builds for each configuration...

LESSGO (less.go via @lessgo/plugin-vite)
----------------------------------------
  Run 1/5... 3.98s
  Run 2/5... 4.08s
  Run 3/5... 4.06s
  Run 4/5... 3.99s
  Run 5/5... 4.08s

LESS.JS (Vite built-in)
----------------------------------------
  Run 1/5... 4.88s
  Run 2/5... 4.81s
  Run 3/5... 5.01s
  Run 4/5... 4.96s
  Run 5/5... 4.97s

============================================================
RESULTS
============================================================

LESSGO Build Times:
  Min:    3.98s
  Max:    4.08s
  Avg:    4.04s
  Median: 4.06s
  Output: 447.47 KB

LESS.JS Build Times:
  Min:    4.81s
  Max:    5.01s
  Avg:    4.93s
  Median: 4.96s
  Output: 447.51 KB

COMPARISON (using median times):
----------------------------------------
  LESSGO is 0.90s (18.2%) FASTER

Output Size Comparison:
  LESSGO output is 34 Bytes (0.0%) smaller
```

## Project Structure

```
src/
├── styles/
│   └── variables.less      # Shared variables and mixins
├── components/
│   ├── Layout.jsx/less     # Main layout wrapper
│   └── Navigation.jsx/less # Navigation with dropdowns
├── pages/
│   ├── Home.jsx/less       # Home page
│   ├── AnimalProfile.jsx/less  # Shared profile component
│   └── animals/
│       ├── index.jsx       # Imports all animal LESS files
│       ├── GoldenRetriever.less
│       ├── Husky.less
│       ├── Persian.less
│       ├── Siamese.less
│       ├── Parrot.less
│       ├── ... (40 unique animal themes)
│       └── HermitCrab.less
```

## What's Being Measured

The benchmark measures the **total Vite build time** which includes:
- LESS to CSS compilation (the main differentiator)
- JavaScript bundling with esbuild
- Asset optimization
- Output file generation

The LESS compilation portion is where lessgo provides the performance advantage, as it uses a Go-based compiler that runs natively rather than in the Node.js runtime.

## Notes

- Results may vary based on hardware and system load
- The benchmark uses production builds (`vite build`)
- Each run starts with a clean dist directory
- Output sizes should be nearly identical (CSS output is equivalent)
