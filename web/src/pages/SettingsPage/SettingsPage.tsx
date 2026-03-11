import { useState } from 'react'

import { Metadata, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import { Button } from 'src/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'src/components/ui/card'
import { Input } from 'src/components/ui/input'
import { Label } from 'src/components/ui/label'
import { Separator } from 'src/components/ui/separator'

const UPDATE_MY_USERNAME_MUTATION = gql`
  mutation UpdateMyUsernameMutation($username: String!) {
    updateMyUsername(username: $username) {
      id
      username
    }
  }
`

const SettingsPage = () => {
  const { currentUser, reauthenticate, forgotPassword } = useAuth()

  const [username, setUsername] = useState(
    (currentUser?.username as string) ?? ''
  )
  const [resetSent, setResetSent] = useState(false)
  const [resetting, setResetting] = useState(false)

  const [updateMyUsername, { loading: updatingUsername }] = useMutation(
    UPDATE_MY_USERNAME_MUTATION,
    {
      onCompleted: async () => {
        toast.success('Username updated successfully.')
        await reauthenticate()
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = username.trim()
    if (!trimmed) {
      toast.error('Username cannot be empty.')
      return
    }
    if (trimmed === (currentUser?.username as string)) {
      toast.error('Username is unchanged.')
      return
    }
    await updateMyUsername({ variables: { username: trimmed } })
  }

  const handleResetPassword = async () => {
    setResetting(true)
    try {
      await forgotPassword(currentUser?.email as string)
      setResetSent(true)
      toast.success('Password reset email sent. Check your inbox.')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to send reset email.'
      )
    } finally {
      setResetting(false)
    }
  }

  return (
    <>
      <Metadata title="Settings" description="Account settings" />

      <div className="tw-mx-auto tw-max-w-2xl tw-space-y-6">
        <div>
          <h1 className="tw-text-2xl tw-font-semibold tw-text-foreground">
            Settings
          </h1>
          <p className="tw-text-sm tw-text-muted-foreground">
            Manage your account information and security.
          </p>
        </div>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle className="tw-text-base">Profile</CardTitle>
            <CardDescription>
              Update your display name. Your email address cannot be changed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateUsername} className="tw-space-y-4">
              <div className="tw-space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={(currentUser?.email as string) ?? ''}
                  disabled
                  readOnly
                  className="tw-bg-muted"
                />
              </div>

              <div className="tw-space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your username"
                  disabled={updatingUsername}
                />
              </div>

              <div className="tw-flex tw-justify-end">
                <Button type="submit" size="sm" disabled={updatingUsername}>
                  {updatingUsername ? 'Saving…' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="tw-text-base">Security</CardTitle>
            <CardDescription>
              Reset your password via email. A link will be sent to your
              registered email address.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="tw-flex tw-items-center tw-justify-between">
              <div className="tw-space-y-0.5">
                <p className="tw-text-sm tw-font-medium tw-text-foreground">
                  Password
                </p>
                <p className="tw-text-xs tw-text-muted-foreground">
                  {resetSent
                    ? 'Reset email sent — check your inbox.'
                    : 'Send a password reset link to your email.'}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResetPassword}
                disabled={resetting || resetSent}
              >
                {resetting
                  ? 'Sending…'
                  : resetSent
                    ? 'Email Sent'
                    : 'Reset Password'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default SettingsPage
