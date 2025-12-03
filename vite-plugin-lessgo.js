import { compile } from 'lessgo';
import fs from 'fs';
import path from 'path';

/**
 * Vite plugin for using less.go (lessc-go) as the LESS preprocessor
 *
 * This plugin intercepts .less imports and compiles them using the
 * lessgo Node.js API, bypassing Vite's built-in LESS handling.
 *
 * @param {Object} options - Plugin options
 * @param {boolean} [options.compress] - Minify CSS output
 * @param {string[]} [options.paths] - Additional include paths for @import resolution
 * @param {Object} [options.globalVars] - Global variables to inject
 * @param {Object} [options.modifyVars] - Variables to modify
 */
export default function lessgoPlugin(options = {}) {
  // Use .css extension in virtual module ID so Vite treats it as CSS
  const VIRTUAL_PREFIX = '\0lessgo-compiled:';
  const VIRTUAL_SUFFIX = '.css';

  // Regex patterns for hook filters
  const LESS_FILE_REGEX = /\.less$/;
  const VIRTUAL_ID_REGEX = /^\0lessgo-compiled:/;

  // Map virtual IDs back to original .less file paths
  const virtualToLess = new Map();

  return {
    name: 'vite-plugin-lessgo',
    enforce: 'pre', // Run before Vite's built-in CSS handling

    // Use hook filter to only trigger for .less imports
    resolveId: {
      filter: {
        id: LESS_FILE_REGEX,
      },
      handler(source, importer) {
        // Backward compatibility: also check inside handler
        if (!source.endsWith('.less')) {
          return null;
        }

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
      },
    },

    // Use hook filter to only trigger for our virtual modules
    load: {
      filter: {
        id: VIRTUAL_ID_REGEX,
      },
      async handler(id) {
        // Backward compatibility: also check inside handler
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
          // Build include paths - always include the file's directory
          const includePaths = [path.dirname(lessPath)];
          if (options.paths) {
            includePaths.push(...options.paths);
          }

          // Compile using lessgo Node.js API
          const result = await compile(lessPath, {
            paths: includePaths,
            compress: options.compress,
            globalVars: options.globalVars,
            modifyVars: options.modifyVars,
          });

          // Return compiled CSS for Vite to process
          return {
            code: result.css,
            map: null,
          };
        } catch (error) {
          throw new Error(`[lessgo] Failed to compile ${lessPath}: ${error.message}`);
        }
      },
    },
  };
}
