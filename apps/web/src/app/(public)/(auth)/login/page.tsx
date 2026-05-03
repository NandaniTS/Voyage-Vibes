"use client";

import { Button, Input } from "@heroui/react";
import { TLogInRequest } from "@repo/definitions";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BiLock } from "react-icons/bi";
import { BsArrowRight, BsEye } from "react-icons/bs";
import { CgMail } from "react-icons/cg";
import { FiEyeOff } from "react-icons/fi";
import { RiLoader2Fill } from "react-icons/ri";
import { authApiWithoutSession } from "../../../../services/auth";
import { useAuth } from "../../../lib/auth-context";
import { getApiSession } from "../../../../config/api-session";
import toast from "react-hot-toast";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLogInRequest>();

  const router = useRouter();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const loginUserMutation = useMutation({
    mutationKey: ["login-user"],
    mutationFn: async (data: TLogInRequest) => {
      return (await authApiWithoutSession.user_login(data)).data;
    },
    onSuccess: (response) => {
      login(response.user);
      toast.success("Login successful");
      localStorage.setItem("token", response.token);
      getApiSession().setToken(response.token);
      if (response.user.userType === "agent") {
        router.push("/agent/packages");
      } else if (response.user.userType === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/traveller/browse");
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const onSubmit = async (data: TLogInRequest) => {
    // router.push("/agent");
    try {
      loginUserMutation.mutate(data);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-(--foreground)">
          Welcome back
        </h1>
        <p className="mt-2 text-(--muted-foreground)">
          Sign in to continue your adventure
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {loginUserMutation.isError && (
          <div className="rounded-lg bg-(--destructive)/10 p-3 text-sm text-(--destructive)">
            {loginUserMutation.error?.message ||
              "Login failed. Please try again."}
          </div>
        )}

        <div className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email">Email address</label>
            <div
              className={`border ${
                errors.email ? "border-(--destructive)" : "border-(--border)"
              } rounded-lg flex items-center mt-2 h-10`}
            >
              <CgMail className="h-5 w-5 ml-2 text-(--muted-foreground)" />

              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                classNames={{
                  base: "flex-1",
                  inputWrapper: "h-9 bg-transparent shadow-none border-none focus-within:ring-0 focus-within:outline-none",
                  input: "h-9 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
                }}
                // className="flex-1 h-full border-none shadow-none focus:ring-0 w-full "
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email",
                  },
                })}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-(--destructive)">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password">Password</label>
              <Link
                href="/forgot-password"
                className="text-sm text-(--primary) hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div
              className={`relative border ${errors.password ? "border-(--destructive)" : "border-(--border)"} px-2 h-10 rounded-lg flex items-center justify-center mt-2`}
            >
              <BiLock className="h-5 w-5 text-(--muted-foreground)" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                classNames={{
                  base: "flex-1",
                  inputWrapper: "h-9 bg-transparent shadow-none border-none focus-within:ring-0 focus-within:outline-none",
                  input: "h-9 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
                }}
                // className={`h-full pr-10 `}
                {...register("password", {
                  required: "Password is required",
                })}
              />
              <Button
                type="button"
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-1 text-(--muted-foreground) hover:text-(--foreground)"
              >
                {showPassword ? (
                  <FiEyeOff className="h-4 w-4" />
                ) : (
                  <BsEye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-(--destructive)">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="h-12 w-full rounded-lg flex items-center justify-center gap-2 text-base bg-(--primary) text-white"
          disabled={loginUserMutation.isPending}
        >
          {loginUserMutation.isPending ? (
            <>
              <RiLoader2Fill className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <BsArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>

        {/* Divider */}
        {/* <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-(--border)" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-(--background) px-4 text-(--muted-foreground)">
              Or continue with
            </span>
          </div>
        </div> */}
      </form>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-(--muted-foreground)">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-(--primary) hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
