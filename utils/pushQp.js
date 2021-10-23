import { stringify } from 'qs'
import { merge, defaultTo } from 'ramda'

export const buildPath = (router, path) => (qp) => {
  const { pathname, query } = defaultTo({})(router)
  const qps = stringify(merge(query || {})(qp), { skipNulls: true })

  return `${path || pathname}?${qps}`
}

export const pushQp = (router, path) => (qp) => {
  router.push(buildPath(router, path)(qp))
}
