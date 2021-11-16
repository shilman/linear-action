<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# Linear action

An action that creates [Linear](https://linear.app/) issues from Github issues when they are labeled `linear`. This is useful when you are aggregating issues across multiple Github organizations, or when you are running an open-source project where the Github issues and activity is public, but you want to plan your work privately.

## Using the action

In your git repository, create a file `.github/workflows/linear.yml` with the following contents:

```yml
# .github/workflows/linear.yml

name: Export to linear

on:
  issues:
    types: [labeled]
  pull_request:
    types: [labeled]

jobs:
  trigger:
    if: github.event.label.name == 'linear'
    name: Export to linear
    runs-on: ubuntu-latest
    steps:
      - name: Linear action
        uses: shilman/linear-action@v1
        with:
          ghIssueNumber: ${{ github.event.issue.number }}
          ghRepoName: ${{ github.event.repository.name }}
          ghToken: ${{ secrets.LINEAR_GH_TOKEN }}
          linearIssuePrefix: SB # See below
          linearLabel: Storybook # see below
          linearPRLabel: PR # see below
          linearTeam: CH # See below
          linearApiKey: ${{ secrets.LINEAR_API_KEY }}
```

## Developing the action

```bash
$ npm install
$ npm run build && npm run package
$ npm test
```

## Publish to a distribution branch

Actions are run from GitHub repos so we will checkin the packed dist folder.

Then run [ncc](https://github.com/zeit/ncc) and push the results:

```bash
$ npm run package
$ git add dist
$ git commit -a -m "prod dependencies"
$ git push origin releases/v1
```

Note: We recommend using the `--license` option for ncc, which will create a license file for all of the production node modules used in your project.

Your action is now published! :rocket:

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

<!-- ## Validate

You can now validate the action by referencing `./` in a workflow in your repo (see [test.yml](.github/workflows/test.yml))

```yaml
uses: ./
with:
  milliseconds: 1000
``` -->

See the [actions tab](https://github.com/actions/typescript-action/actions) for runs of this action! :rocket:

## Usage:

After testing you can [create a v1 tag](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md) to reference the stable and latest V1 action
