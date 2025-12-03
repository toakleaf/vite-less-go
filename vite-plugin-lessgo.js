import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * Vite plugin for using less.go (lessc-go) as the LESS preprocessor
 *
 * This plugin intercepts .less imports and returns compiled CSS,
 * bypassing Vite's built-in LESS handling.
 */
export default function lessgoPlugin(options = {}) {
  // Try to find the lessc-go binary
  const findBinary = () => {
    const locations = [
      path.join(os.homedir(), 'go', 'bin', 'lessc-go'),
      path.join(process.cwd(), 'node_modules', '@lessgo', `${os.platform()}-${os.arch()}`, 'bin', 'lessc-go'),
    ];

    for (const loc of locations) {
      if (fs.existsSync(loc)) {
        return loc;
      }
    }

    try {
      const which = os.platform() === 'win32' ? 'where' : 'which';
      const result = execFileSync(which, ['lessc-go'], { encoding: 'utf8' }).trim();
      if (result) return result.split('\n')[0];
    } catch {
      // Not in PATH
    }

    throw new Error(
      'lessc-go binary not found. Install it via:\n' +
      '  go install github.com/toakleaf/less.go/cmd/lessc-go@latest'
    );
  };

  let binaryPath;
  // Use .css extension in virtual module ID so Vite treats it as CSS
  const VIRTUAL_PREFIX = '\0lessgo-compiled:';
  const VIRTUAL_SUFFIX = '.css';

  // Map virtual IDs back to original .less file paths
  const virtualToLess = new Map();

  return {
    name: 'vite-plugin-lessgo',
    enforce: 'pre', // Run before Vite's built-in CSS handling

    configResolved() {
      binaryPath = findBinary();
      console.log(`[lessgo] Using binary: ${binaryPath}`);
    },

    resolveId(source, importer) {
      // Handle .less imports
      if (source.endsWith('.less')) {
        // Resolve the actual file path
        let resolvedPath;
        if (path.isAbsolute(source)) {
          resolvedPath = source;
        } else if (importer) {
          resolvedPath = path.resolve(path.dirname(importer), source);
        } else {
          resolvedPath = path.resolve(source);
        }

        // Create a virtual module ID ending in .css
        const virtualId = VIRTUAL_PREFIX + resolvedPath + VIRTUAL_SUFFIX;
        virtualToLess.set(virtualId, resolvedPath);

        return virtualId;
      }
      return null;
    },

    load(id) {
      // Handle our virtual modules
      if (!id.startsWith(VIRTUAL_PREFIX)) {
        return null;
      }

      const lessPath = virtualToLess.get(id);
      if (!lessPath) {
        return null;
      }

      if (!fs.existsSync(lessPath)) {
        throw new Error(`[lessgo] LESS file not found: ${lessPath}`);
      }

      try {
        // Compile with lessc-go
        let css = execFileSync(binaryPath, [lessPath], {
          encoding: 'utf8',
          maxBuffer: 50 * 1024 * 1024,
          cwd: path.dirname(lessPath),
        });

        // Return as CSS for Vite to process
        return {
          code: css,
          map: null,
        };
      } catch (error) {
        throw new Error(`[lessgo] Failed to compile ${lessPath}: ${error.message}`);
      }
    },
  };
}
