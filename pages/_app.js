import { useEffect } from 'react'
import '../styles/globals.scss'
import 'https://cdn.jsdelivr.net/npm/@coreui/coreui@4.0.0/dist/css/coreui.min.css'
import '../styles/public.scss'

export default function MyApp({ Component, pageProps }) {
  // 使用自訂在頁面層級的版面(layout)
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap')
  }, [])

  const getLayout = Component.getLayout || ((page) => page)

  return getLayout(<Component {...pageProps} />)
}
