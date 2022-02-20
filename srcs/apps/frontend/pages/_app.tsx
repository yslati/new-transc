import { useRouter } from 'next/router'
import { Provider, useSelector } from 'react-redux'
import { useAppSelector } from '../app/hooks'
import { store } from '../app/store'
import '../styles/globals.css'
import '../styles/Carousel.css'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BrowserRouter, HashRouter } from 'react-router-dom'

function SafeHydrate({ children }) {
  return (
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ? null : children}
    </div>
  )
}

function Redirect({ to }) {

  const { pathname, push } = useRouter();
  useEffect(() => {
    push(to);
  },  []);
  return <></>
}
const guestRoutes = ['/', '/login', '/profile'];

function BeforeUp({ children }) {
  const { pathname, push } = useRouter();
  const [loaded, setLoaded] = useState(false);
  // if (!auth.logged && pathname !== '/login')
  //   return <Redirect to="/login" />
  
  
  // if (guestRoutes.findIndex((element) => element === pathname) === -1) 
  // if (!guestRoutes.find(path => pathname === path)) {
  //   return <Redirect to="/404" />
  // }

 
  return (
    <>
      {children}
    </>
  )
}


function MyApp({ Component, pageProps }) {
  return (
    <SafeHydrate>
      <Provider store={store}>
          <HashRouter>
            <Component {...pageProps} />
          </HashRouter>
      </Provider>
    </SafeHydrate>
  )
}

export default MyApp
