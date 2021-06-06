import Reargs from 'reargs'
import fs from 'fs'
import {
  inspect
} from 'util'
import generateHelp from './genhelp'
import pkginfo from './pkginfo'
import testParams from './test'

/*
 * This function will try to find a possible name for the parameter found.
 * Algorithm is quite straightforward since we just remove non alphanumeric
 * characters.
 */
const findPossibleName = (input) => {
  if (!input || typeof(input) !== 'string') {
    return false
  }

  const result = input.replace(/\W/g, '')
  if (result.length === 0) {
    return false
  }
  return result
}

const mapWithRegex = (input) => {
  for (const [key, value] of Object.entries(kv_regex)) {
    const reKey = new RegExp(key)
    const hasMatched = reKey.exec(input)
    if (hasMatched !== null) {
      return [key, value]
    }
  }

  // if we cannot find a customized mapping, try our best to detect
  // the possible key and use the default value as a replacement regex
  if (!values.noDefaultAttrib) {
    const keyFind = /=([A-Z]+)$/.exec(input)
    if (keyFind !== null) {
      return [keyFind[1], values.defaultRx]
    }
  }

  return [null]
}

const debug = process.env.DEBUG || false

const opts = {
  longShortDelimiter: ', ',
  paramDescriptionSpacer: ' '
}

const params = {
  getParams: {
    group: 'command',
    short: 'get params',
    help: 'get parameters for Reargs invocation (default action)',
    values: true
  },
  genHelp: {
    group: 'command',
    short: 'gen(erate)? help',
    help: 'generate help from retrieved parameters (input must be JSON!)',
  },
  test: {
    group: 'command',
    short: 'test',
    help: 'test parsing, everything after -- will be passed to test parameters'
  },
  doubledash: {
    short: '--',
    hidden: true,
    stopParse: true
  },
  template: {
    short: '-t[=|\\ ](?<template>[^\\ ]+)',
    long: '--template[=|\\ ](?<template>[^\\ ]+)',
    help: 'use this template file to generate help'
  },
  help: {
    group: 'option',
    short: '-h',
    long: '--help',
    help: 'this help message',
  },
  from: {
    group: 'option',
    short: '-f[=|\\ ](?<from>[^\\ ]+)',
    long: '(--)from[=|\\ ](?<from>[^\\ ]+)',
    humanReadable: '-f, [--]from=FILE',
    help: 'read input from file or - for stdin (default is -)',
    values: '-'
  },
  output: {
    group: 'option',
    short: '-o[=|\\ ](?<output>(json|plain|pretty))',
    long: '--output[=|\\ ](?<output>(json|plain|pretty))',
    humanReadable: '-o, --output=json|plain|pretty',
    help: 'output format, JSON, pretty JSON or Plain Javascript Object (default: plain)',
    values: {
      output: 'plain'
    }
  },
  patternFile: {
    group: 'option',
    short: '-p[=|\\ ](?<patternFile>[^\\ ]+)',
    long: '--pattern-file[=|\\ ](?<patternFile>[^\\ ]+)',
    humanReadable: '-p, --pattern-file=FILE',
    help: 'use regular expressions from FILE',
  },
  verbose: {
    group: 'option',
    short: '-(?<verbose>vv?v?)',
    humanReadable: '-v, -vv or -vvv',
    help: 'be more verbose'
  },
  removeUndefined: {
    group: 'option',
    short: '-r',
    long: '--remove-undefined',
    help: 'remove undefined properties',
  },
  convert: {
    group: 'option',
    short: '-c',
    long: '--convert',
    help: 'automatic convert of [] to optional in regular expression builder'
  },
  noDefaultAttrib: {
    group: 'option',
    short: '-nda',
    long: '--no-default-attribute',
    help: 'disable default parameter attribute replacement',
    values: false
  },
  defaultAttrib: {
    group: 'option',
    short: '-da[=\\ ](?<defaultRx>[^\\ ]+)',
    humanReadable: '-da[=| ]PATTERN',
    help: 'use this PATTERN as default when no other attribute pattern has been found (default: [^\\ ]+)',
    values: {
      defaultRx: '[^\\ ]+'
    }
  },
  attribRegexp: {
    group: 'option',
    short: '-a ',
    humanReadable: '-a key=value,...',
    help: 'when an attribute can be set like -f=FILE, set a regexp to match FILE (default: unchanged)',
    captureMultiple: '(?<re_keys>[\\w]+)=(?<re_values>[^,\\ ]+)?,?',
    multiple: true,
    values: {
      // re_keys: '',
      re_values: ''
    }
  }
}

const myArgs = new Reargs(params, opts, debug)

const unparsable = myArgs.parse(process.argv.slice(2))

const values = myArgs.getAllValues()

let v = () => {}
let vv = () => {}
let vvv = () => {}

vvv(inspect(values))

if (unparsable.length > 0) {
  console.log('Could not understand:', unparsable)
  console.log('Please run "reargs -h" for help')
  process.exit(0)
}

if (values.help) {
  console.log(myArgs.generateHelp(pkginfo))
  process.exit(0)
}

switch (values.verbose.length) {
  case 3:
    vvv = console.debug
  case 2:
    vv = console.debug
  case 1:
    v = console.debug
  default:

}

v('verbosity level', values.verbose)

const file = values.from === '-' ? '/dev/stdin' : values.from
vv('reading input from', file)

process.stdin.resume()

if (values.genHelp) {
  const returnValue = generateHelp(file, values.template)
  process.exit(returnValue)
} else if (values.test) {
  const returnValue = testParams(file, myArgs.remain)
  process.exit(returnValue)
}

const defaultRegex = /^\ +(?<short>-[^-,\ ]+(?:\ [<\[]\w+[>\]])?)*(,?\ ?(?<long>--[^,\ ]+),?)*\ +(?<help>[^\n]+(?:\n[^-\n]+$)*)/gm

vvv('default regex', defaultRegex.toString())

const kv_regex = {}

// process key values pairs
const {
  re_keys,
  re_values
} = values

if (re_keys instanceof Array) {
  re_keys.forEach((key, index) => {
    kv_regex[key] = re_values[index]
  })
}

const inputHelp = fs.readFileSync(process.stdin.fd).toString()

// Try to load a pattern file if such exists
const {
  patternFile
} = values
vv('using custom pattern file ?', patternFile)
let listOfRegEx = []

if (patternFile) {
  try {
    const input = fs.readFileSync(patternFile)
    listOfRegEx = JSON.parse(input)
    if (!(listOfRegEx instanceof Array)) {
      throw new TypeError(`Must be an array, got ${inspect(listOfRegEx)}`)
    }
  } catch (e) {
    console.error('Could not read/parse file', input, inspect(e))
    process.exit(0)
  }
}

listOfRegEx.push(defaultRegex)

let bestIncrements = {},
  bestResult = {}

listOfRegEx.forEach((regex, i) => {
  const result = {}
  const increments = {
    param: 1
  }
  let regexLine
  do {
    regexLine = regex.exec(inputHelp)
    if (regexLine !== null && regexLine.groups !== null) {
      let {
        short,
        long,
        help
      } = regexLine.groups

      const shortName = findPossibleName(short)
      const longName = findPossibleName(long)

      let key = 'param'

      if (!!longName) {
        key = longName
      } else if (!!shortName) {
        key = shortName
      }

      if (result[key]) {
        if (!increments[key]) {
          increments[key] = 1
        } else {
          increments[key]++
        }
        key = `${key}_${increments[key]}`
      }

      // make sure we keep untouched original "human readable" version
      let humanReadableArray = []

      // find if short or long strings match with one of the key values mapping
      if (!!short) {
        humanReadableArray.push(short)
        const [key, value] = mapWithRegex(short)
        if (values.convert) {
          const beforeReplace = short
          short = short.replace(/\[([^\w]+)([\w]+)\]/, `$1?(?<$2>${value})?`)
          if (beforeReplace === short) {
            short = short.replace(key, `(?<${key}>${value})`)
          }
        } else {
          short = short.replace(key, value)
        }
      }

      if (!!long) {
        humanReadableArray.push(long)
        const [key, value] = mapWithRegex(long)

        let indexOfOptional

        if (key !== null) {
          if (values.convert) {
            indexOfOptional = long.indexOf('[')
            vvv('key', key, 'index', indexOfOptional)
            if (indexOfOptional >= 0) {
              long = long.replace(/\[([^\w]+)([\w]+)\]/, `$1?(?<$2>${value})?`)

              if (!!short) {
                short = `${short}${long.slice(indexOfOptional)}`
              }
            } else {
              indexOfOptional = long.indexOf(key)
              vvv('key', key, 'index', indexOfOptional)
              long = long.replace(key, `(?<${key}>${value})`)

              if (!!short && indexOfOptional >= 0) {
                short = `${short}${long.slice(indexOfOptional)}`
              }
            }
          } else {
            indexOfOptional = long.indexOf(key)
            vvv('key', key, 'index', indexOfOptional)
            long = long.replace(key, value)

            if (!!short && indexOfOptional >= 0) {
              short = `${short}${long.slice(indexOfOptional)}`
            }
          }
        }
      }

      const humanReadable = humanReadableArray.join(', ')

      const currentParam = {
        short,
        long,
        humanReadable,
        help
      }

      if (values.removeUndefined) {
        Object.keys(currentParam).forEach(key => currentParam[key] === undefined && delete currentParam[key])
      }

      result[key] = currentParam
    }

  } while (regexLine !== null)

  if (bestIncrements.param === undefined || increments.param < bestIncrements.param) {
    vv(`Found a better suited RegExp: ${regex.toString()} (param count: ${increments.param})`)
    bestResult = result
    bestIncrements = increments
  }
});

for (const [key, param] of Object.entries(bestResult)) {
  const {
    short,
    long,
    help
  } = param
  vv(`short: ${short} long: ${long} help: ${help}`)
}

switch (values.output) {
  case 'json':
    console.log(JSON.stringify(bestResult))
    break;
  case 'pretty':
    console.log(JSON.stringify(bestResult, undefined, 2))
    break;
  default:
    console.log(`exports = ${inspect(bestResult)}`)
}

v('finished processing')
process.exit(0)
