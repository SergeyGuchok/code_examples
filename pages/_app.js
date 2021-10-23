
import React from 'react'
import { ApolloProvider } from '@apollo/client'
import { ChakraProvider, theme } from '@chakra-ui/react'
import { useApollo } from 'lib/apolloClient'
import moment from 'moment'

import 'react-datepicker/dist/react-datepicker.css'
import '../styles/react-datepicker.scss'
import 'moment/locale/ru'
import 'chartjs-adapter-moment'
import 'react-timelines/lib/css/style.css'
import 'react-day-picker/lib/style.css'
import 'styles/subscriptions.scss'
import 'styles/question.scss'

moment.locale('ru')

const App = ({ Component, pageProps }) => {
  const apolloClient = useApollo(pageProps)

  return (
    <ChakraProvider theme={theme}>
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
      </ApolloProvider>
    </ChakraProvider>
  )
}

export default App
