import Reargs from 'reargs'
import rw from 'rw'
import {
  inspect
} from 'util'

export default function(file, remain) {
  let message = ''
  const customDebugFn = (...args) => {
    message += args.join(' ') + '\n'
  }

  try {
    let params = null
    const input = rw.readFileSync(file)

    try {
      params = JSON.parse(input)
    } catch (e) {
      params = eval(input.toString())
    }

    const inputArgs = new Reargs(params, {
      longShortDelimiter: ', ',
      paramDescriptionSpacer: ' '
    }, customDebugFn)

    const unparsable = inputArgs.parse(remain.split(' '))
    console.log('unparsable', unparsable)
    console.log('values', inspect(inputArgs.getAllValues()))

  } catch (e) {
    console.error('An error has been thrown !', e)
    return 1
  }

  return 0
}
