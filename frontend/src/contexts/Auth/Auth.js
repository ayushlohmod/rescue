import React, { createContext, useEffect, useState } from 'react'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import Logo from 'assets/logo.svg'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate } from 'react-router-dom'
import { getCollection } from 'helpers'
import { getAuthenticatedUser, updatePublicUserProfile } from './utils'
import { Landing } from 'components'
import { Onboarding } from 'chakra_components'
import { Loading } from 'chakra_components/Loading/Loading'

// We create a Context to allow Auth state to be accessed from any component in the tree
// without passing the data directly as a prop
// Read more about Contexts in React: https://reactjs.org/docs/context.html
const AuthContext = createContext()
AuthContext.displayName = 'Auth'

function Auth({ children }) {
  const navigate = useNavigate()
  // we use an imported React Hook create state variables
  // user defines the current auth state,
  // loading defines whether a request is currently running
  // error defines whether we received a bad response from firebase
  const [user, loading, error] = useAuthState(firebase.auth())
  // profile looks up the user in the firestore db
  // to get additional permissions and profile data
  const [publicProfile, setPublicProfile] = useState(null)
  const [privateProfile, setPrivateProfile] = useState(null)

  useEffect(() => {
    const uid = user ? user.uid : localStorage.getItem('se_user_id')
    let publicProfileUnsubscribe
    let privateProfileUnsubscribe
    if (uid) {
      const publicProfileRef = getCollection('public_profiles').doc(uid)
      const privateProfileRef = getCollection('private_profiles').doc(uid)
      publicProfileUnsubscribe = publicProfileRef.onSnapshot(doc =>
        setPublicProfile(doc.data())
      )
      privateProfileUnsubscribe = privateProfileRef.onSnapshot(doc =>
        setPrivateProfile(doc.data())
      )
      user && localStorage.setItem('se_user_id', user.uid)
    } else {
      setPublicProfile(undefined)
      setPrivateProfile(undefined)
    }
    return () => {
      publicProfileUnsubscribe && publicProfileUnsubscribe()
      privateProfileUnsubscribe && privateProfileUnsubscribe()
    }
  }, [user])

  function handleLogout() {
    localStorage.removeItem('se_user_id')
    firebase.auth().signOut()
    navigate('/')
  }

  async function handleLogin() {
    const user = await getAuthenticatedUser()
    updatePublicUserProfile(user)
    navigate('/')
  }

  function Error() {
    return (
      <main id="Auth">
        <h1>
          <span className="green">Sharing</span> Excess
        </h1>
        <p>Looks like there was an error logging in.</p>
        <img className="background" src={Logo} alt="Sharing Excess Logo" />
        <button onClick={() => window.location.reload()}>try again</button>
      </main>
    )
  }

  function AuthWrapper({ children }) {
    return (
      <AuthContext.Provider
        value={{
          user: user ? { ...user, ...publicProfile, ...privateProfile } : null,
          // admin: profile && profile.is_admin,
          // driver: profile && profile.is_driver && !profile.is_admin,
          // permission: profile && (profile.is_admin || profile.is_driver),
          hasAdminPermission: publicProfile?.permission === 'admin',
          hasStandardPermissions: publicProfile?.permission === 'standard',
          hasPermission: publicProfile?.permission,
          hasCompletedPrivateProfile: privateProfile,
          handleLogout,
          handleLogin,
        }}
      >
        {children}
      </AuthContext.Provider>
    )
  }

  if (publicProfile === null) {
    // Case 1: the user has signed in,
    // and the query to check for a public profile
    // has not yet returned.
    // Render a loading screen until the query returns.
    return (
      <AuthWrapper>
        <Loading text="Signing In" />
      </AuthWrapper>
    )
  } else if (user && publicProfile === undefined) {
    // Case 2: this is a brand new user.
    // They have signed in, and the public profile
    // query returned 'undefined', meaning they
    // do not have a public profile yet.
    // Render the onboarding component,
    // with access to the user object.
    return (
      <AuthWrapper>
        <Onboarding />
      </AuthWrapper>
    )
  } else if (user && publicProfile) {
    // Case 3: the user has signed in,
    // and has completed their public profile.
    // We can now render the app normally. Woo!
    return <AuthWrapper>{children}</AuthWrapper>
  } else if (error) {
    // Case 4: there was an error in the auth process,
    // Render an error screen.
    return <Error />
  } else {
    // Case 5: if there is no signed in user,
    // render the landing page with sign in action.
    return <Landing handleLogin={handleLogin} />
  }
}

export { Auth, AuthContext }
