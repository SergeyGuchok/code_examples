import {
  applySpec,
  compose,
  path,
  ifElse,
  filter,
  pathEq,
  propEq,
  equals,
  when,
  isNil,
  not,
  or,
  head,
  find,
} from 'ramda'
import { useEffect } from 'react'

import { pushQp } from 'utils/pushQp'

export const getGroupUuid = path(['group', 'uuid'])

const withUserGroup = (Component) => {
  const WithUserGroup = (props) => {
    const {
      currentUser: { user_groups },
      query: { group_uuid },
      router,
    } = props
    const currentUserGroup = find((item) => equals(getGroupUuid(item), group_uuid))(user_groups)

    useEffect(() => {
      ifElse(
        () => or(equals('loading')(group_uuid), isNil(group_uuid)),
        compose(
          when(
            compose(not, pathEq(['group', 'uuid'], 'loading')),
            compose(pushQp(router), applySpec({ group_uuid: getGroupUuid }))
          ),
          head,
          filter(compose(not, propEq('role', 'personal')))
        ),
        applySpec({ group_uuid })
      )(user_groups)
    }, [user_groups])

    return <Component {...props} currentUserGroup={currentUserGroup} />
  }

  return WithUserGroup
}

export default withUserGroup
