"use client"

import { useState, useContext } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/Components/ui/card"
import { Alert, AlertDescription } from "@/Components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Form, Field } from "react-final-form"
import {UserContext} from "@/Components/ContextualStore/UserContext";
import { useDispatch, useSelector } from 'react-redux'
import { loginUsers } from '../reducer/login.reducer'

export default function Login() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { setIsUserLogedIn} = useContext(UserContext)
  const dispatch = useDispatch()
  const loginState = useSelector((state) => state.login)
  const { data, loading, error: loginError, loginSuccess, isLoginError } = loginState

  const onSubmit = async (values) => {
    setError("")
    console.log("values",values)
    if (!values.email || !values.password) {
      setError("Email and password are required")
      return
    }

    setIsLoading(true)

    try {
      dispatch(loginUsers(values))
      if(loginSuccess){
        setIsUserLogedIn(true)
        router.push("/")
      }else{
        setError("Something went wrong")
      }
    } catch (err) {
      setError("Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <Form
            onSubmit={onSubmit}
            render={({ handleSubmit }) => (
                <form onSubmit={handleSubmit} className="w-full max-w-md">
                  <Card>
                    <CardHeader className="space-y-1">
                      <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
                      <CardDescription className="text-center">Log in to your todo account</CardDescription>
                    </CardHeader>
                    <CardContent>
                      { isLoginError && (
                          <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{loginError}</AlertDescription>
                          </Alert>
                      )}

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Field name="email">
                            {({ input }) => (
                                <Input
                                    {...input}
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    disabled={isLoading || loading}
                                    isError={isLoginError}
                                    required
                                />
                            )}
                          </Field>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <Link href="/Auth/ForgetPassword" className="text-sm text-primary hover:underline">
                              Forgot password?
                            </Link>
                          </div>
                          <Field name="password">
                            {({ input }) => (
                                <Input
                                    {...input}
                                    id="password"
                                    type="password"
                                    disabled={isLoading || loading}
                                    required
                                    isError={isLoginError}                                    
                                />
                            )}
                          </Field>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Field name="rememberMe" type="checkbox">
                            {({ input }) => (
                                <>
                                  <input
                                      {...input}
                                      type="checkbox"
                                      id="rememberMe"
                                      className="w-4 h-4"
                                  />
                                  <Label
                                      htmlFor="rememberMe"
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    Remember me
                                  </Label>
                                </>
                            )}
                          </Field>
                        </div>

                          <Button type="submit" className="w-full" disabled={isLoading || loading}>
                          {isLoading || loading ? "Logging in..." : "Log In"}
                        </Button>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                      <p className="text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link href="/Auth/SignUp" className="text-primary font-medium hover:underline">
                          Sign up
                        </Link>
                      </p>
                    </CardFooter>
                  </Card>
                </form>
            )}
        />
      </div>
  )
}
