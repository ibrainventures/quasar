const prefix = 'mdi-'
const packageName = '@mdi/svg'

// ------------

const glob = require('glob')
const { readFileSync, writeFileSync } = require('fs')
const { resolve, basename } = require('path')

let skipped = 0
const dist = resolve(__dirname, `../${prefix}svg.js`)

const svgFolder = resolve(__dirname, `../node_modules/${packageName}/svg/`)
const svgFiles = glob.sync(svgFolder + '/**/*.svg')

function extract (file) {
  const content = readFileSync(file, 'utf-8')

  const name = (prefix + basename(file, '.svg')).replace(/(-\w)/g, m => m[1].toUpperCase())

  try {
    const dPath = content.match(/ d="([\w ,\.-]+)"/)[1]
    const viewBox = content.match(/viewBox="([0-9 ]+)"/)[1]

    return `export const ${name} = "${dPath}|${viewBox}"`
  }
  catch (err) {
    skipped++
    return null
  }
}

function getBanner () {
  const { version } = require(resolve(__dirname, `../node_modules/${packageName}/package.json`))
  return `/* MDI v${version} */\n\n`
}

const svgExports = []

svgFiles.forEach(file => {
  svgExports.push(extract(file))
})

writeFileSync(dist, getBanner() + svgExports.join('\n'), 'utf-8')

if (skipped > 0) {
  console.log('mdi - skipped: ' + skipped)
}