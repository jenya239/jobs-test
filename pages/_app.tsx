import { AppProps } from 'next/app'
import 'fomantic-ui-css/semantic.min.css'

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  return <Component {...pageProps} />
}

export default App
