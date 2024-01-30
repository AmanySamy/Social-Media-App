import { SigninValidation } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Loader from "@/components/shared/Loader"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"

const SigninForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const { mutateAsync: signInAccount, isPending } = useSignInAccount()

  // 1. Define your form.
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
    }
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    const session = await signInAccount({ email: values.email, password: values.password })
    if (!session) {
      toast({ title: 'Signin failed. please try again' });
      return;
    }

    const isLoggedin = await checkAuthUser();
    if (isLoggedin) {
      form.reset();
      navigate('/')
    } else {
      return toast({ title: 'Signin failed. please try again' });
    }
  }
  return (
    <Form {...form}>
      <div className="flex-center flex-col sm:w-420">
        <img src="/assets/images/logo.svg" alt="Logo" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Login to your account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use Snapgram, please enter your details
        </p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input className="shad-input" type="email" placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
         
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input className="shad-input" type="password" placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="shad-button_primary w-full py-3" type="submit">{
            isPending || isUserLoading
              ? (<div className="flex-center gap-2">
                <Loader /> Loading...
              </div>)
              : "Sign In"
          }</Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Don't have an account?
            <Link to="/sign-up" className="text-primary-500 text-small-semibold ml-1">Sign up</Link>
          </p>
        </form>
      </div>
    </Form>

  )
}

export default SigninForm