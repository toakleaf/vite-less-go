import { spawn } from 'child_process'
import { performance } from 'perf_hooks'
import fs from 'fs'
import path from 'path'

const RUNS = 5

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
}

runBenchmark().catch(console.error)
