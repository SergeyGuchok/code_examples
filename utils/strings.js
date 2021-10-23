import { is, when, propOr, comparator, sort as ramdaSort, lt, gt } from 'ramda'

export const w = (str) => str.split(' ')

export const sort = (getPropFunc, sortType = 'asc') => (array) => ramdaSort(
  comparator((a, b) => sortType === 'asc'
    ? gt(getPropFunc(a), getPropFunc(b))
    : lt(getPropFunc(a), getPropFunc(b))
  )
)(array)

export const toBool =
  when(
    is(String),
    (a) => propOr(a)(a)({ true: true, false: false})
  )
