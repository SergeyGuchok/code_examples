import { gql, useLazyQuery } from '@apollo/client'
import { compact } from 'ramda-adjunct'
import { equals, gte } from 'ramda'

const use = (q, vars = {}) => {
  const { query, variables, skeleton, mandatoryVariables, extendVariablesKeys } = q
  const [run, { data, loading, error, called, refetch }] = useLazyQuery(
    gql`
      ${query}
    `
  )

  return [
    (...args) => {
      if (gte(compact(args).length, mandatoryVariables || variables.length)) {
        return run({ variables: extendVariablesKeys(variables(...args)), ...vars })
      }
    },
    { data: loading || !called ? skeleton : data, loading, error, called, refetch },
  ]
}

export default use
