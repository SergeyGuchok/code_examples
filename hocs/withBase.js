import { pushQp } from '../utils/pushQp'

const withBase = (Component) => {
  const WithBase = (props) => {
    const { router } = props
    const changeQp = pushQp(router)
    const onChangeBase = (item) => {
      const { isBase } = item

      changeQp({
        isBase: isBase !== '' ? isBase : undefined,
      })
    }

    return (
      <Component
        onChangeBase={onChangeBase}
        {...props}
      />
    )
  }

  return WithBase
}

export default withBase
