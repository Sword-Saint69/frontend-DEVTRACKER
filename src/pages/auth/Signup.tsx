"use client";
import React, { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

export default function SignupPage() {
  const [userName, setUserName] = useState<string>("");
  const [uuId, setUuId] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Call the backend signup endpoint
      await axios.post(api.auth.signup, {
        userName,
        uuId,
        email,
        password,
        position,
      });

      // After successful signup -> redirect to login page
      alert("Account created successfully! Please login.");
      navigate("/login");
    } catch (err: any) {
      console.error("Signup failed:", err);
      
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Signup failed! Please try again.");
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Welcome to DevTracker
        </h2>
        <p className="mt-2 max-w-sm text-sm text-gray-600 dark:text-gray-300">
          Create your account to start tracking your development projects
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="userName">Full Name</Label>
            <Input 
              id="userName" 
              placeholder="Goutham sankar" 
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="uuId">User ID</Label>
            <Input 
              id="uuId" 
              placeholder="Goutham123" 
              type="text"
              value={uuId}
              onChange={(e) => setUuId(e.target.value)}
              required
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              placeholder="goutham@devtracker.com" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              placeholder="••••••••" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="confirmpassword">Confirm Password</Label>
            <Input
              id="confirmpassword"
              placeholder="••••••••"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-8">
            <Label htmlFor="position">Position</Label>
            <select
              id="position"
              className="flex h-10 w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-gray-900 transition duration-400 placeholder:text-gray-500 focus-visible:ring-[2px] focus-visible:ring-blue-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-white dark:focus-visible:ring-blue-500 dark:placeholder:text-gray-400"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
            >
              <option value="">Select Position</option>
              <option value="MANAGER">Manager</option>
              <option value="DEVELOPER">Developer</option>
              <option value="TESTER">Tester</option>
              <option value="CLIENT">Client</option>
              <option value="LEAD">Lead</option>
            </select>
          </LabelInputContainer>

          <button
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 font-medium text-white shadow-lg transition-all duration-200 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800"
            type="submit"
          >
            Sign up &rarr;
            <BottomGradient />
          </button>

          <div className="text-center mt-6">
            <Link to="/login" className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              Already have an account? Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};