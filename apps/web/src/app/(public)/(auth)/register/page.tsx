"use client";

import React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CiPlane } from "react-icons/ci";
import { BiBriefcase, BiLock } from "react-icons/bi";
import { FaCheck, FaUser } from "react-icons/fa";
import { Button, cn, Input } from "@heroui/react";
import { CgMail } from "react-icons/cg";
import { FiEyeOff } from "react-icons/fi";
import { BsArrowRight, BsEye } from "react-icons/bs";
import { RiLoader2Fill } from "react-icons/ri";
import { BsTelephone } from "react-icons/bs";
import { useMutation } from "@tanstack/react-query";
import { TCreateUserRequest, UserTypeEnum } from "@repo/definitions";
import { authApiWithoutSession } from "../../../../services/auth";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

type UserType = "traveler" | "agent";

export default function RegisterPage() {

  const {handleSubmit, register, formState:{errors}} = useForm<TCreateUserRequest>();

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedType,setSelectedType] = useState<string>(UserTypeEnum.TRAVELLER);

  const signUpUserMutation = useMutation({
    mutationFn: async (data: TCreateUserRequest) => {
      return await authApiWithoutSession.signup(data);
    },
    onSuccess: () => {
      router.push("/login");
      toast.success("User Registered Successfully");
    },
  });

  const onSubmit = (data:TCreateUserRequest)=>{
    signUpUserMutation.mutate({...data, userType: selectedType as TCreateUserRequest["userType"]});
  }

  const userTypeOptions = [
    {
      value: UserTypeEnum.TRAVELLER,
      label: "Traveller",
      description: "Book trips and explore destinations",
      icon: CiPlane,
    },
    {
      value: UserTypeEnum.AGENT,
      label: "Travel Agent",
      description: "Create and manage trip packages",
      icon: BiBriefcase,
    },
  ];

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
          Create your account
        </h1>
        <p className="mt-2 text-muted-foreground">
          Start your journey with Travel Junction
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {signUpUserMutation.isError && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {signUpUserMutation.error?.message ||
              "Signup failed. Please try again."}
          </div>
        )}

        {/* User Type Selection */}
        <div className="space-y-3">
          <label>I am a</label>
          <div className="grid grid-cols-2 gap-3">
            {userTypeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  setSelectedType(option.value)
                }
                className={`relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all hover:border-(--primary)/50
                  ${
                    selectedType === option.value
                      ? "border-(--primary) bg-(--primary)/5"
                      : "border-(--border)"
                  }
                `}
              >
                {selectedType === option.value && (
                  <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-(--primary)">
                    <FaCheck className="h-3 w-3 text-(--primary-foreground)" />
                  </div>
                )}
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                    selectedType === option.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <option.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium text-(--foreground)">
                    {option.label}
                  </p>
                  <p className="text-xs text-(--muted-foreground)">
                    {option.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {/* Full Name Field */}
          <div className="space-y-2">
            <label htmlFor="fullName">Full name</label>
            <div
             className={`border ${
                errors.fullName?.message ? "border-(--destructive)" : "border-(--border)"
              } rounded-lg flex items-center mt-2 h-10`} >
              <FaUser className="h-5 w-5 ml-2 text-(--muted-foreground)"  />
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                classNames={{
                  base: "flex-1",
                  inputWrapper: "h-9 bg-transparent shadow-none border-none focus-within:ring-0 focus-within:outline-none",
                  input: "h-9 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
                }}
                {...register("fullName", {
                  required: "Name is required",
                })}
                
              />
            </div>
            {errors.fullName && (
              <p className="text-sm text-destructive">{errors.fullName?.message}</p>
            )}
          </div>

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
                  inputWrapper:
                    "h-9 bg-transparent shadow-none border-none focus-within:ring-0 focus-within:outline-none",
                  input:
                    "h-9 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
                }}
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

          {/* Phone Number Field */}
          <div className="space-y-2">
            <label htmlFor="phoneNumber">Phone number</label>
            <div
              className={`border ${
                errors.phoneNumber ? "border-(--destructive)" : "border-(--border)"
              } rounded-lg flex items-center mt-2 h-10`}
            >
              <BsTelephone className="h-5 w-5 ml-2 text-(--muted-foreground)" />
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+1 234 567 8900"
                classNames={{
                  base: "flex-1",
                  inputWrapper: "h-9 bg-transparent shadow-none border-none focus-within:ring-0 focus-within:outline-none",
                  input: "h-9 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
                }}
                {...register("phoneNumber", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^\+?[0-9\s\-().]{7,20}$/,
                    message: "Please enter a valid phone number",
                  },
                })}
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-sm text-(--destructive)">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password">Password</label>
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
                  inputWrapper:
                    "h-9 bg-transparent shadow-none border-none focus-within:ring-0 focus-within:outline-none",
                  input:
                    "h-9 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
                }}
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

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword">Confirm password</label>
          <div
           className={`relative border ${
                errors.password ? "border-(--destructive)" : "border-(--border)"
              } rounded-lg flex items-center mt-2 h-10`}
          >
            <BiLock className="h-5 w-5 ml-2 text-(--muted-foreground)"/>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              classNames={{
                  base: "flex-1",
                  inputWrapper: "h-9 bg-transparent shadow-none border-none focus-within:ring-0 focus-within:outline-none",
                  input: "h-9 text-sm focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
                }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? (
                <FiEyeOff className="h-4 w-4" />
              ) : (
                <BsEye className="h-4 w-4" />
              )}
            </button>
          </div>
          {/* {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword}</p>
          )} */}
        </div>

        <Button
          type="submit"
          className="h-12 w-full gap-2 text-base rounded-lg flex items-center justify-center bg-(--primary) text-white"
          disabled={signUpUserMutation.isPending}
        >
          {signUpUserMutation.isPending ? (
            <>
              <RiLoader2Fill className="h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              Create account
              <BsArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Sign In Link */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
