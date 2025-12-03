import { spawn } from 'child_process'
import { performance } from 'perf_hooks'
import fs from 'fs'
import path from 'path'
import less from 'less'
import lessgo from 'lessgo'

const RUNS = 5
const SRC_DIR = 'src'

// Parse command line arguments
const args = process.argv.slice(2)
const COMPARE_ONLY = args.includes('--compare-only') || args.includes('-c')
const SKIP_COMPARE = args.includes('--skip-compare') || args.includes('-s')

// =============================================================================
// OUTPUT COMPARISON FUNCTIONS
// =============================================================================

/**
 * Recursively find all .less files in a directory
 */
function findLessFiles(dir) {
  const files = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...findLessFiles(fullPath))
    } else if (entry.name.endsWith('.less')) {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * Compile LESS file using less.js
 */
async function compileWithLessJs(filePath) {
  const source = fs.readFileSync(filePath, 'utf-8')
  const options = {
    filename: filePath,
    paths: [path.dirname(filePath)],
    javascriptEnabled: true,
  }

  try {
    const result = await less.render(source, options)
    return { css: result.css, error: null }
  } catch (error) {
    return { css: null, error: error.message }
  }
}

/**
 * Compile LESS file using lessgo
 */
async function compileWithLessGo(filePath) {
  const options = {
    paths: [path.dirname(filePath)],
  }

  try {
    // lessgo.compile takes a file path directly (not content)
    const result = await lessgo.compile(filePath, options)
    return { css: result.css, error: null }
  } catch (error) {
    return { css: null, error: error.message }
  }
}

/**
 * Normalize CSS for comparison (remove insignificant whitespace differences)
 */
function normalizeCSS(css) {
  if (!css) return ''
  return css
    // Normalize line endings
    .replace(/\r\n/g, '\n')
    // Remove trailing whitespace on lines
    .replace(/[ \t]+$/gm, '')
    // Normalize multiple newlines to single
    .replace(/\n{3,}/g, '\n\n')
    // Trim
    .trim()
}

/**
 * Create a simple diff between two strings
 */
function createDiff(lessjs, lessgo, maxContext = 3) {
  const linesA = lessjs.split('\n')
  const linesB = lessgo.split('\n')
  const diffs = []

  let i = 0
  let j = 0

  while (i < linesA.length || j < linesB.length) {
    if (i >= linesA.length) {
      // Remaining lines only in lessgo
      diffs.push({ type: 'add', line: j + 1, content: linesB[j] })
      j++
    } else if (j >= linesB.length) {
      // Remaining lines only in lessjs
      diffs.push({ type: 'remove', line: i + 1, content: linesA[i] })
      i++
    } else if (linesA[i] === linesB[j]) {
      // Lines match
      i++
      j++
    } else {
      // Lines differ - find where they sync back up
      let foundSync = false
      for (let lookAhead = 1; lookAhead < 10 && !foundSync; lookAhead++) {
        if (i + lookAhead < linesA.length && linesA[i + lookAhead] === linesB[j]) {
          // Lines were removed from lessjs
          for (let k = 0; k < lookAhead; k++) {
            diffs.push({ type: 'remove', line: i + k + 1, content: linesA[i + k] })
          }
          i += lookAhead
          foundSync = true
        } else if (j + lookAhead < linesB.length && linesA[i] === linesB[j + lookAhead]) {
          // Lines were added in lessgo
          for (let k = 0; k < lookAhead; k++) {
            diffs.push({ type: 'add', line: j + k + 1, content: linesB[j + k] })
          }
          j += lookAhead
          foundSync = true
        }
      }
      if (!foundSync) {
        // Just mark as changed
        diffs.push({ type: 'remove', line: i + 1, content: linesA[i] })
        diffs.push({ type: 'add', line: j + 1, content: linesB[j] })
        i++
        j++
      }
    }
  }

  return diffs
}

/**
 * Format diff for display with context
 */
function formatDiff(diffs, lessjs, lessgo, maxLines = 30) {
  if (diffs.length === 0) return ''

  const lines = []
  const lessjsLines = lessjs.split('\n')
  const lessgoLines = lessgo.split('\n')
  const shown = diffs.slice(0, maxLines)

  // Group consecutive diffs together
  let lastLineShown = -3
  for (const diff of shown) {
    // Show context if there's a gap
    if (diff.line - lastLineShown > 3) {
      if (lastLineShown > 0) {
        lines.push('  ...')
      }
      // Show 1 line of context before
      const contextLine = diff.line - 2
      if (contextLine >= 0) {
        const sourceLines = diff.type === 'add' ? lessgoLines : lessjsLines
        if (sourceLines[contextLine]) {
          lines.push(`     ${String(contextLine + 1).padStart(4)}| ${sourceLines[contextLine]}`)
        }
      }
    }

    const prefix = diff.type === 'add' ? '+' : '-'
    const label = diff.type === 'add' ? 'lessgo' : 'less.js'
    lines.push(`  ${prefix} [${label}] ${String(diff.line).padStart(4)}| ${diff.content}`)
    lastLineShown = diff.line
  }

  if (diffs.length > maxLines) {
    lines.push(`  ... and ${diffs.length - maxLines} more differences`)
  }

  return lines.join('\n')
}

/**
 * Save comparison results to a file for detailed review
 */
function saveComparisonReport(results, outputPath = 'comparison-report.txt') {
  const lines = []
  lines.push('='.repeat(80))
  lines.push('LESSGO vs LESS.JS OUTPUT COMPARISON REPORT')
  lines.push('Generated: ' + new Date().toISOString())
  lines.push('='.repeat(80))
  lines.push('')

  lines.push('SUMMARY')
  lines.push('-'.repeat(40))
  lines.push(`Identical outputs: ${results.identical.length}`)
  lines.push(`Different outputs: ${results.different.length}`)
  lines.push(`Compilation errors: ${results.errors.length}`)
  lines.push('')

  if (results.different.length > 0) {
    lines.push('='.repeat(80))
    lines.push('DETAILED DIFFERENCES')
    lines.push('='.repeat(80))

    for (const diff of results.different) {
      lines.push('')
      lines.push(`FILE: ${diff.file}`)
      lines.push('-'.repeat(80))
      lines.push('')
      lines.push('ORIGINAL LESS INPUT:')
      lines.push('-'.repeat(40))
      diff.source.split('\n').forEach((line, i) => {
        lines.push(`${String(i + 1).padStart(4)}| ${line}`)
      })
      lines.push('')
      lines.push('LESS.JS OUTPUT:')
      lines.push('-'.repeat(40))
      diff.lessjsCss.split('\n').forEach((line, i) => {
        lines.push(`${String(i + 1).padStart(4)}| ${line}`)
      })
      lines.push('')
      lines.push('LESSGO OUTPUT:')
      lines.push('-'.repeat(40))
      diff.lessgoCss.split('\n').forEach((line, i) => {
        lines.push(`${String(i + 1).padStart(4)}| ${line}`)
      })
      lines.push('')
    }
  }

  if (results.errors.length > 0) {
    lines.push('')
    lines.push('='.repeat(80))
    lines.push('COMPILATION ERRORS')
    lines.push('='.repeat(80))

    for (const err of results.errors) {
      lines.push('')
      lines.push(`FILE: ${err.file}`)
      if (err.lessjsError) {
        lines.push(`  less.js error: ${err.lessjsError}`)
      }
      if (err.lessgoError) {
        lines.push(`  lessgo error: ${err.lessgoError}`)
      }
    }
  }

  fs.writeFileSync(outputPath, lines.join('\n'))
  return outputPath
}

/**
 * Compare outputs from both compilers for all LESS files
 */
async function compareOutputs() {
  console.log('')
  console.log('='.repeat(60))
  console.log('CSS OUTPUT COMPARISON')
  console.log('='.repeat(60))
  console.log('')
  console.log('Compiling all LESS files with both compilers...')
  console.log('')

  const lessFiles = findLessFiles(SRC_DIR)
  console.log(`Found ${lessFiles.length} LESS files to compare`)
  console.log('')

  const results = {
    identical: [],
    different: [],
    errors: [],
  }

  for (const filePath of lessFiles) {
    const relativePath = path.relative('.', filePath)
    process.stdout.write(`  Comparing ${relativePath}... `)

    const [lessjsResult, lessgoResult] = await Promise.all([
      compileWithLessJs(filePath),
      compileWithLessGo(filePath),
    ])

    // Handle compilation errors
    if (lessjsResult.error || lessgoResult.error) {
      results.errors.push({
        file: relativePath,
        lessjsError: lessjsResult.error,
        lessgoError: lessgoResult.error,
      })
      console.log('ERROR')
      continue
    }

    // Compare normalized outputs
    const normalizedLessjs = normalizeCSS(lessjsResult.css)
    const normalizedLessgo = normalizeCSS(lessgoResult.css)

    if (normalizedLessjs === normalizedLessgo) {
      results.identical.push(relativePath)
      console.log('IDENTICAL')
    } else {
      const source = fs.readFileSync(filePath, 'utf-8')
      const diffs = createDiff(normalizedLessjs, normalizedLessgo)
      results.different.push({
        file: relativePath,
        source,
        lessjsCss: lessjsResult.css,
        lessgoCss: lessgoResult.css,
        normalizedLessjs,
        normalizedLessgo,
        diffs,
      })
      console.log('DIFFERENT')
    }
  }

  // Print summary
  console.log('')
  console.log('-'.repeat(60))
  console.log('COMPARISON SUMMARY')
  console.log('-'.repeat(60))
  console.log(`  Identical outputs: ${results.identical.length}`)
  console.log(`  Different outputs: ${results.different.length}`)
  console.log(`  Compilation errors: ${results.errors.length}`)
  console.log('')

  // Print details for differences
  if (results.different.length > 0) {
    console.log('='.repeat(60))
    console.log('DIFFERENCES FOUND')
    console.log('='.repeat(60))

    for (const diff of results.different) {
      console.log('')
      console.log(`FILE: ${diff.file}`)
      console.log('-'.repeat(60))

      // Show first 20 lines of the input LESS file
      const sourceLines = diff.source.split('\n')
      const previewLines = sourceLines.slice(0, 20)
      console.log('INPUT (first 20 lines):')
      previewLines.forEach((line, i) => {
        console.log(`  ${String(i + 1).padStart(3)}: ${line}`)
      })
      if (sourceLines.length > 20) {
        console.log(`  ... (${sourceLines.length - 20} more lines)`)
      }
      console.log('')

      console.log('OUTPUT DIFFERENCES:')
      console.log(formatDiff(diff.diffs, diff.normalizedLessjs, diff.normalizedLessgo))
      console.log('')
    }
  }

  // Print errors
  if (results.errors.length > 0) {
    console.log('')
    console.log('='.repeat(60))
    console.log('COMPILATION ERRORS')
    console.log('='.repeat(60))

    for (const err of results.errors) {
      console.log('')
      console.log(`FILE: ${err.file}`)
      if (err.lessjsError) {
        console.log(`  less.js error: ${err.lessjsError}`)
      }
      if (err.lessgoError) {
        console.log(`  lessgo error: ${err.lessgoError}`)
      }
    }
  }

  // Save detailed report to file if there are differences
  if (results.different.length > 0) {
    const reportPath = saveComparisonReport(results)
    console.log('')
    console.log('-'.repeat(60))
    console.log(`Full report saved to: ${reportPath}`)
    console.log('(Contains complete input/output for all files with differences)')
  }

  return results
}

// =============================================================================
// BUILD BENCHMARK FUNCTIONS
// =============================================================================

function runBuild(configFile, label) {
  return new Promise((resolve, reject) => {
    const args = ['build']
    if (configFile) {
      args.push('--config', configFile)
    }

    const start = performance.now()
    const proc = spawn('npx', ['vite', ...args], {
      stdio: 'pipe',
      shell: true,
    })

    let stdout = ''
    let stderr = ''

    proc.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    proc.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    proc.on('close', (code) => {
      const end = performance.now()
      const duration = end - start

      if (code !== 0) {
        console.error(`${label} build failed:`)
        console.error(stderr)
        reject(new Error(`Build failed with code ${code}`))
        return
      }

      resolve({
        label,
        duration,
        success: true,
      })
    })

    proc.on('error', (err) => {
      reject(err)
    })
  })
}

function getDirectorySize(dirPath) {
  let totalSize = 0

  if (!fs.existsSync(dirPath)) {
    return 0
  }

  const files = fs.readdirSync(dirPath, { recursive: true })

  for (const file of files) {
    const filePath = path.join(dirPath, file)
    try {
      const stats = fs.statSync(filePath)
      if (stats.isFile()) {
        totalSize += stats.size
      }
    } catch (e) {
      // Skip files that can't be accessed
    }
  }

  return totalSize
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function formatDuration(ms) {
  return `${(ms / 1000).toFixed(2)}s`
}

function calculateStats(durations) {
  const sorted = [...durations].sort((a, b) => a - b)
  const min = sorted[0]
  const max = sorted[sorted.length - 1]
  const avg = durations.reduce((a, b) => a + b, 0) / durations.length
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)]

  return { min, max, avg, median }
}

async function cleanDist() {
  const dirs = ['dist', 'dist-lessjs']
  for (const dir of dirs) {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true })
    }
  }
}

async function runBenchmark() {
  console.log('='.repeat(60))
  console.log('LESSGO vs LESS.JS VITE BUILD BENCHMARK')
  console.log('='.repeat(60))
  console.log('')
  console.log(`Running ${RUNS} builds for each configuration...`)
  console.log('')

  const lessgoResults = []
  const lessjsResults = []

  // Run lessgo builds
  console.log('LESSGO (less.go via @lessgo/plugin-vite)')
  console.log('-'.repeat(40))

  for (let i = 0; i < RUNS; i++) {
    await cleanDist()
    process.stdout.write(`  Run ${i + 1}/${RUNS}... `)
    try {
      const result = await runBuild('vite.config.js', 'lessgo')
      lessgoResults.push(result.duration)
      console.log(formatDuration(result.duration))
    } catch (err) {
      console.log('FAILED')
      console.error(err.message)
    }
  }

  console.log('')

  // Run less.js builds
  console.log('LESS.JS (Vite built-in)')
  console.log('-'.repeat(40))

  for (let i = 0; i < RUNS; i++) {
    await cleanDist()
    process.stdout.write(`  Run ${i + 1}/${RUNS}... `)
    try {
      const result = await runBuild('vite.config.lessjs.js', 'lessjs')
      lessjsResults.push(result.duration)
      console.log(formatDuration(result.duration))
    } catch (err) {
      console.log('FAILED')
      console.error(err.message)
    }
  }

  console.log('')

  // Final builds for output size comparison
  console.log('Building final outputs for size comparison...')
  await cleanDist()
  await runBuild('vite.config.js', 'lessgo')
  await runBuild('vite.config.lessjs.js', 'lessjs')

  const lessgoSize = getDirectorySize('dist')
  const lessjsSize = getDirectorySize('dist-lessjs')

  // Print results
  console.log('')
  console.log('='.repeat(60))
  console.log('RESULTS')
  console.log('='.repeat(60))
  console.log('')

  if (lessgoResults.length > 0) {
    const lessgoStats = calculateStats(lessgoResults)
    console.log('LESSGO Build Times:')
    console.log(`  Min:    ${formatDuration(lessgoStats.min)}`)
    console.log(`  Max:    ${formatDuration(lessgoStats.max)}`)
    console.log(`  Avg:    ${formatDuration(lessgoStats.avg)}`)
    console.log(`  Median: ${formatDuration(lessgoStats.median)}`)
    console.log(`  Output: ${formatBytes(lessgoSize)}`)
    console.log('')
  }

  if (lessjsResults.length > 0) {
    const lessjsStats = calculateStats(lessjsResults)
    console.log('LESS.JS Build Times:')
    console.log(`  Min:    ${formatDuration(lessjsStats.min)}`)
    console.log(`  Max:    ${formatDuration(lessjsStats.max)}`)
    console.log(`  Avg:    ${formatDuration(lessjsStats.avg)}`)
    console.log(`  Median: ${formatDuration(lessjsStats.median)}`)
    console.log(`  Output: ${formatBytes(lessjsSize)}`)
    console.log('')
  }

  // Comparison
  if (lessgoResults.length > 0 && lessjsResults.length > 0) {
    const lessgoStats = calculateStats(lessgoResults)
    const lessjsStats = calculateStats(lessjsResults)

    console.log('COMPARISON (using median times):')
    console.log('-'.repeat(40))

    const diff = lessjsStats.median - lessgoStats.median
    const percentFaster = ((diff / lessjsStats.median) * 100).toFixed(1)

    if (diff > 0) {
      console.log(`  LESSGO is ${formatDuration(diff)} (${percentFaster}%) FASTER`)
    } else if (diff < 0) {
      const percentSlower = ((Math.abs(diff) / lessgoStats.median) * 100).toFixed(1)
      console.log(`  LESS.JS is ${formatDuration(Math.abs(diff))} (${percentSlower}%) FASTER`)
    } else {
      console.log(`  Both are equal`)
    }

    const sizeDiff = lessjsSize - lessgoSize
    const sizeDiffPercent = ((sizeDiff / lessjsSize) * 100).toFixed(1)

    console.log('')
    console.log('Output Size Comparison:')
    if (sizeDiff > 0) {
      console.log(`  LESSGO output is ${formatBytes(sizeDiff)} (${sizeDiffPercent}%) smaller`)
    } else if (sizeDiff < 0) {
      console.log(`  LESS.JS output is ${formatBytes(Math.abs(sizeDiff))} smaller`)
    } else {
      console.log(`  Output sizes are identical`)
    }
  }

  console.log('')
  console.log('='.repeat(60))
  console.log('')

  // Run output comparison
  if (!SKIP_COMPARE) {
    await compareOutputs()
  }
}

async function main() {
  if (COMPARE_ONLY) {
    // Just run the comparison without the benchmark
    await compareOutputs()
  } else {
    await runBenchmark()
  }
}

main().catch(console.error)
