import * as core from '@actions/core'
import {linearExport} from './linear-export'

async function run(): Promise<void> {
  core.debug(`Exporting to linear`)
  try {
    const ghIssueNumber: number = parseInt(core.getInput('ghIssueNumber'), 10)
    const ghRepoOwner: string = core.getInput('ghRepoOwner')
    const ghRepoName: string = core.getInput('ghRepoName')
    const ghToken: string = core.getInput('ghToken')
    const linearIssuePrefix: string = core.getInput('issuePrefix')
    const linearLabel: string = core.getInput('linearLabel')
    const linearPRLabel: string = core.getInput('linearPRLabel')
    const linearTeam: string = core.getInput('linearTeam')
    const linearApiKey: string = core.getInput('linearApiKey')

    core.debug(`Parsed args`)

    core.debug(new Date().toTimeString())
    const url = await linearExport({
      ghIssueNumber,
      ghRepoOwner,
      ghRepoName,
      ghToken,
      linearIssuePrefix,
      linearLabel,
      linearPRLabel,
      linearTeam,
      linearApiKey
    })
    core.debug(new Date().toTimeString())

    core.setOutput('Exported', url)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
