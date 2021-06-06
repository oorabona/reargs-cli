import Reargs from 'reargs'
import rw from 'rw'
import {
  inspect
} from 'util'

export default function(file, templateFile) {
  let message = ''
  const customDebugFn = (...args) => {
    message += args.join(' ') + '\n'
  }

  try {
    let params = null
    const input = rw.readFileSync(file)
    let template

    if (templateFile) {
      template = rw.readFileSync(templateFile).toString()
    }

    try {
      params = JSON.parse(input)
    } catch (e) {
      params = eval(input.toString())
    }

    const inputArgs = new Reargs(params, {
      longShortDelimiter: ', ',
      paramDescriptionSpacer: ' '
    }, customDebugFn)

    console.log(inputArgs.generateHelp({}, template))

  } catch (e) {
    console.error('An error has been thrown !', e)
    return 1
  }

  return 0
}
