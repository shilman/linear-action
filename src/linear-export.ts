/* eslint-disable sort-imports */
import {info as debug} from '@actions/core'
import {IssueLabel, LinearClient, Issue as LinearIssue} from '@linear/sdk'
import {GHQuery, githubClient} from './github-client'

type GHIssue = {
  id: number
  url: string
  title: string
  body: string
  isPr: boolean
}

const getGHIssue = async (
  issue: number,
  owner: string,
  name: string,
  github: GHQuery
): Promise<GHIssue> => {
  const data = await github(
    `
    query($owner: String!, $name: String!, $issue: Int!) {
      repository(owner:$owner, name:$name) {
        issueOrPullRequest(number: $issue) {
          __typename
          ... on Issue {
            title
            body
            url
          }
          ... on PullRequest {
            title
            body
            url
          }
        }
      }
    }`,
    {
      owner,
      name,
      issue
    }
  )
  const {title, body, url, __typename} = data.repository.issueOrPullRequest
  return {id: issue, title, body, url, isPr: __typename === 'PullRequest'}
}

const findLinearIssue = async (
  issueKey: string,
  linear: LinearClient
): Promise<LinearIssue | undefined> => {
  const existing = await linear.issueSearch(issueKey)
  return existing.nodes.length > 0 ? existing.nodes[0] : undefined
}

const getLabelId = (labelName: string, labels: IssueLabel[]): string => {
  const found = labels.find(label => label.name === labelName)
  if (!found) throw new Error(`Couldn't find label ${labelName}`)
  return found.id
}

interface LinearExportArgs {
  ghIssueNumber: number
  ghRepoOwner: string
  ghRepoName: string
  ghToken: string
  linearIssuePrefix: string
  linearTeam: string
  linearLabel: string
  linearPRLabel: string
  linearApiKey: string
}

export const linearExport = async ({
  ghIssueNumber,
  ghRepoOwner,
  ghRepoName,
  ghToken,
  linearIssuePrefix,
  linearLabel,
  linearPRLabel,
  linearTeam,
  linearApiKey
}: LinearExportArgs): Promise<string | undefined> => {
  if (isNaN(ghIssueNumber)) {
    throw new Error(`ghIssueNumber must be a number`)
  }

  const linear = new LinearClient({apiKey: linearApiKey})
  const github = githubClient(ghToken)

  debug(`Linear export ${ghIssueNumber}`)

  const issue = await getGHIssue(ghIssueNumber, ghRepoOwner, ghRepoName, github)
  const issueKey = `${linearIssuePrefix}${ghIssueNumber}`
  const existingIssue = await findLinearIssue(issueKey, linear)
  if (existingIssue) {
    debug(`Existing linear issue, skipping: ${existingIssue.url}`)
    return
  }

  const team = await linear.team(linearTeam)
  if (!team) throw new Error(`Couldn't find team ${linearTeam}`)
  const issueLabels = (await team.labels()).nodes

  const labelIds = [getLabelId(linearLabel, issueLabels)]
  if (issue.isPr) labelIds.push(getLabelId(linearPRLabel, issueLabels))

  const created = await linear.issueCreate({
    teamId: team.id,
    title: `[${issueKey}] ${issue.title}`,
    description: `${issue.url}\n\n${issue.body}`,
    labelIds
  })
  const linearIssue = await created?.issue
  if (!linearIssue) throw new Error(`Couldn't create issue ${issueKey}`)

  debug(`Created ${linearIssue?.url}`)

  await linear.attachmentCreate({
    issueId: linearIssue.id,
    title: issue.title,
    url: issue.url
  })

  return linearIssue.url
}
