"use client"

import { useEffect, useMemo, useState } from "react"
import { firebase, auth, firestore, firebaseConfigReady } from "@/lib/firebase/client"
import { generateApiKey, hashSecret } from "@/lib/firebase/api-keys"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FirebaseAuthUI } from "@/components/auth/firebase-auth-ui"

type ApiKeyDoc = {
  id: string
  name?: string
  keyPreview?: string
  createdAt?: { seconds: number }
  active?: boolean
}

function formatDate(doc?: ApiKeyDoc) {
  if (!doc?.createdAt?.seconds) return "—"
  return new Date(doc.createdAt.seconds * 1000).toLocaleDateString()
}

export function ApiKeysManager() {
  if (!firebaseConfigReady) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Firebase config required</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Set the NEXT_PUBLIC_FIREBASE_* environment variables to enable sign-in and API key management.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!auth || !firestore) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading authentication...</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Initializing secure access.
          </p>
        </CardContent>
      </Card>
    )
  }

  const authInstance = auth
  const firestoreInstance = firestore

  const [user, setUser] = useState(() => authInstance.currentUser)
  const [keys, setKeys] = useState<ApiKeyDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [newKey, setNewKey] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [copyStatus, setCopyStatus] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = authInstance.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [authInstance])

  useEffect(() => {
    if (!user) {
      setKeys([])
      setLoading(false)
      return
    }

    setLoading(true)
    const query = firestoreInstance
      .collection("apiKeys")
      .where("userId", "==", user.uid)

    const unsubscribe = query.onSnapshot(
      (snapshot) => {
        const next = snapshot.docs.map((doc) => {
          const data = doc.data() as ApiKeyDoc
          return { ...data, id: doc.id }
        }).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
        setKeys(next)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user])

  const activeKeys = useMemo(
    () => keys.filter((key) => key.active !== false),
    [keys]
  )

  async function handleCreate() {
    if (!user) return
    setError(null)
    setCreating(true)
    try {
      const generated = generateApiKey()
      const secretHash = await hashSecret(generated.secret)
      await firestoreInstance
        .collection("apiKeys")
        .doc(generated.publicId)
        .set({
          userId: user.uid,
          secretHash,
          name: name.trim() || "Default key",
          keyPreview: generated.preview,
          active: true,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        })

      setNewKey(generated.key)
      setName("")
    } catch (err: any) {
      setError(err.message || "Failed to create API key.")
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id: string) {
    if (!user) return
    setError(null)
    try {
      await firestoreInstance.collection("apiKeys").doc(id).delete()
    } catch (err: any) {
      setError(err.message || "Failed to delete API key.")
    }
  }

  async function handleCopy() {
    if (!newKey) return
    setCopyStatus(null)
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(newKey)
        setCopyStatus("Copied")
        return
      }
      const textarea = document.createElement("textarea")
      textarea.value = newKey
      textarea.style.position = "fixed"
      textarea.style.left = "-9999px"
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      const ok = document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopyStatus(ok ? "Copied" : "Copy failed")
    } catch (err: any) {
      setCopyStatus("Copy failed")
    }
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sign in to manage API keys</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Sign in with Google or GitHub to generate API keys for MCP access.
          </p>
          <FirebaseAuthUI />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">Signed in as</div>
          <div className="text-sm font-medium">{user.email || user.uid}</div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => authInstance.signOut()}>
          Sign out
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create a new API key</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Key label (e.g. MCP CLI)"
              className="md:max-w-sm"
            />
            <Button onClick={handleCreate} disabled={creating}>
              {creating ? "Creating..." : "Generate key"}
            </Button>
          </div>
          {newKey && (
            <div className="rounded-lg border border-border p-4">
              <div className="text-sm font-medium">New API key</div>
              <div className="mt-2 break-all text-sm text-muted-foreground">
                {newKey}
              </div>
              <div className="mt-3">
                <Button variant="secondary" size="sm" onClick={handleCopy}>
                  Copy key
                </Button>
                {copyStatus && (
                  <span className="ml-2 text-xs text-muted-foreground">{copyStatus}</span>
                )}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Save this key now. You won’t be able to see it again.
              </p>
            </div>
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active keys</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading keys...</p>
          ) : activeKeys.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No active keys yet. Generate your first key above.
            </p>
          ) : (
            <div className="space-y-3">
              {activeKeys.map((key) => (
                <div
                  key={key.id}
                  className="flex flex-col gap-2 rounded-lg border border-border p-3 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="text-sm font-medium">
                      {key.name || "API key"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {key.keyPreview || key.id} · Created {formatDate(key)}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(key.id)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
