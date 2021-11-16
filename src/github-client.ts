/* eslint-disable @typescript-eslint/no-explicit-any  */

const GITHUB_API = 'https://api.github.com/graphql'

// Jest shenanigans
const fetch = (url: string, options: any): any =>
  // eslint-disable-next-line github/no-then
  import('node-fetch').then(async ({default: actualFetch}) =>
    actualFetch(url, options)
  )

export type GHQuery = (
  query: string,
  variables?: {[key: string]: any}
) => Promise<any>

export const githubClient = (apiKey: string): GHQuery => {
  const client: GHQuery = async (query, variables) => {
    const res = await fetch(GITHUB_API, {
      method: 'POST',
      headers: {
        authorization: `token ${apiKey}`
      },
      body: JSON.stringify({
        query,
        variables
      })
    })

    const result = (await res.json()) as {data: any; errors: any}
    const {data, errors} = result
    if (errors) {
      throw new Error(JSON.stringify(errors[0]))
    }
    return data
  }

  return client
}
