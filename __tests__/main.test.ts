import {linearExport} from '../src/linear-export'
import {expect, test} from '@jest/globals'

const baseArgs = {
  ghIssueNumber: 1,
  ghRepoName: 'storybookjs/storybook',
  ghToken: 'ghToken',
  linearIssuePrefix: 'SB',
  linearTeam: 'CH',
  linearLabel: 'Storybook',
  linearPRLabel: 'PR',
  linearApiKey: 'linearApiKey'
}

test('throws invalid number', async () => {
  const ghIssueNumber = parseInt('foo', 10)
  await expect(
    linearExport({
      ...baseArgs,
      ghIssueNumber
    })
  ).rejects.toThrow('ghIssueNumber must be a number')
})
