import { gql, useMutation } from '@apollo/client'

const use = (q, vars = {}) => {
  const { mutation, variables, skeleton, extendVariablesKeys } = q
  const [run, { data, loading, error, called }] = useMutation(
    gql`
      ${mutation}
    `
  )

  return [
    (...args) => run({ variables: extendVariablesKeys(variables(...args)), ...vars }),
    { data: loading || !called ? skeleton : data, loading, error, called },
  ]
}

export default use
