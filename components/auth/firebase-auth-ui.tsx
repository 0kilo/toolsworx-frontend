"use client"

import { useEffect, useRef } from "react"
import { firebase, auth, firebaseConfigReady } from "@/lib/firebase/client"

const signInOptions = [
  firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  firebase.auth.GithubAuthProvider.PROVIDER_ID,
]

export function FirebaseAuthUI() {
  const initialized = useRef(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const uiRef = useRef<any>(null)

  useEffect(() => {
    if (!firebaseConfigReady || !auth) return
    if (initialized.current) return
    if (auth.currentUser) return
    if (!containerRef.current) return
    initialized.current = true
    let canceled = false

    ;(async () => {
      const firebaseui = await import("firebaseui")
      if (canceled) return
      const ui =
        firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth)
      uiRef.current = ui

      ui.start(containerRef.current, {
        signInFlow: "popup",
        signInOptions,
        credentialHelper: firebaseui.auth.CredentialHelper.NONE,
        callbacks: {
          signInSuccessWithAuthResult: () => false,
        },
      })
    })()

    return () => {
      canceled = true
      if (uiRef.current) {
        uiRef.current.reset()
        uiRef.current = null
      }
    }
  }, [])

  if (!firebaseConfigReady) {
    return (
      <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        Firebase auth is not configured. Add the NEXT_PUBLIC_FIREBASE_* env vars
        to enable sign-in.
      </div>
    )
  }

  return <div id="firebaseui-auth-container" ref={containerRef} />
}
