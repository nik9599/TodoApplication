"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { Form, Field } from "react-final-form"
import { useDispatch, useSelector } from "react-redux"
import { signupUsers } from "../reducer/login.reducer"
// import NavBar from "@/Components/Navbar"

export default function SignUp() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const signupState = useSelector((state) => state.login)
  const { data, loading, error: signupError, signupSuccess, isSignupError } = signupState
 const submitButton = useRef()
  const onSubmit = async (values) => {
    setError("")

    if (!values.username || !values.email || !values.password || !values.confirmPassword) {
      setError("All fields are required")
      return
    }

    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (values.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)

    try {
      dispatch(signupUsers(values))
      if(signupSuccess){
        setSuccess(true)
        setIsLoading(false)
        setTimeout(() => {
          router.push("/Auth/Login")
        }, 1500)
      }
    } catch (err) {
      setError(signupError)
      setIsLoading(false)
    }
  }

  return (
      <>
        {/* <NavBar /> */}
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
              <CardDescription className="text-center">
                Enter your information to create a todo account
              </CardDescription>
            </CardHeader>

            <CardContent>
              { isSignupError || error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
              )}

              {success && (
                  <Alert className="mb-4 bg-green-50 text-green-700 border-green-200">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>Account created successfully! Redirecting to login...</AlertDescription>
                  </Alert>
              )}

              <Form
                  onSubmit={onSubmit}
                  render={({ handleSubmit, values }) => {
                    submitButton.current = handleSubmit
                    return (  
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="username">Full Name</Label>
                          <Field name="username">
                            {({ input }) => (
                                <Input
                                    {...input}
                                    id="username"
                                    placeholder="John Doe"
                                    disabled={isLoading || success}
                                    required
                                />
                            )}
                          </Field>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Field name="email">
                            {({ input }) => (
                                <Input
                                    {...input}
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    disabled={isLoading || success || loading}
                                    required
                                />
                            )}
                          </Field>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <Field name="password">
                            {({ input }) => (
                                <Input
                                    {...input}
                                    id="password"
                                    type="password"
                                    disabled={isLoading || success || loading}
                                    required
                                />
                            )}
                          </Field>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm Password</Label>
                          <Field name="confirmPassword">
                            {({ input }) => (
                                <Input
                                    {...input}
                                    id="confirmPassword"
                                    type="password"
                                    disabled={isLoading || success || loading}
                                    required
                                />
                            )}
                          </Field>
                        </div>

                          <Button type="submit" onClick={() => submitButton.current()} className="w-full">
                            {isLoading || loading ? "Creating Account..." : "Sign Up"}
                          </Button>
                          

                      </form>
                  )}}
              />
            </CardContent>

            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/Auth/Login" className="text-primary font-medium hover:underline">
                  Log in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </>
  )
}
