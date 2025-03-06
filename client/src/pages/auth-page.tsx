import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertUserSchema, UserRole } from "@shared/schema";
import { LoadingAnimation } from "@/components/ui/loading-animation";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [_, setLocation] = useLocation();

  if (user) {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">E-Learning Platform</h1>
            <p className="text-gray-500">
              Welcome to our learning platform. Join us to access quality courses and enhance your skills.
            </p>
          </div>

          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <LoginForm />
            </TabsContent>

            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </div>

        <div className="hidden md:block">
          <div className="h-full rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 p-6 text-white flex items-center justify-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Start Learning Today</h2>
              <ul className="space-y-2">
                <li>✓ Access to quality courses</li>
                <li>✓ Learn at your own pace</li>
                <li>✓ Expert instructors</li>
                <li>✓ Interactive learning experience</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginForm() {
  const { loginMutation } = useAuth();
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(insertUserSchema.pick({ username: true, password: true })),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form 
          onSubmit={form.handleSubmit((data) => {
            loginMutation.mutate(
              {
                username: data.username,
                password: data.password
              },
              {
                onError: (error) => {
                  toast({
                    title: "Login failed",
                    description: error.message,
                    variant: "destructive"
                  });
                }
              }
            );
          })} 
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" {...form.register("username")} />
            {form.formState.errors.username && (
              <p className="text-sm text-red-500">
                {form.formState.errors.username.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input type="password" id="password" {...form.register("password")} />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? (
              <div className="flex items-center justify-center">
                <LoadingAnimation />
              </div>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function RegisterForm() {
  const { registerMutation } = useAuth();
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: UserRole.APPRENANT
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Create a new account to start learning</CardDescription>
      </CardHeader>
      <CardContent>
        <form 
          onSubmit={form.handleSubmit((data) => {
            registerMutation.mutate(
              {
                username: data.username,
                email: data.email,
                password: data.password,
                role: UserRole.APPRENANT
              },
              {
                onError: (error) => {
                  toast({
                    title: "Registration failed",
                    description: error.message,
                    variant: "destructive"
                  });
                },
                onSuccess: () => {
                  toast({
                    title: "Registration successful",
                    description: "Your account has been created. You can now log in.",
                  });
                }
              }
            );
          })} 
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="reg-username">Username</Label>
            <Input id="reg-username" {...form.register("username")} />
            {form.formState.errors.username && (
              <p className="text-sm text-red-500">
                {form.formState.errors.username.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" {...form.register("email")} />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-password">Password</Label>
            <Input type="password" id="reg-password" {...form.register("password")} />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? (
              <div className="flex items-center justify-center">
                <LoadingAnimation />
              </div>
            ) : (
              "Register"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}