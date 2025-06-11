import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loginUser } from "@/features/user/userApi";
import { toast } from "sonner";
import { login } from "@/features/user/userSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      dispatch(login(data.user));

      toast.success(data?.message);
      setEmail("");
      setPassword("");
      if (data?.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Login failed");
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    console.log(mutation);

    mutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-white to-purple-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border">
        <h2 className="md:text-3xl text-2xl md:font-bold font-medium mb-6 text-center text-gray-800">
          Login to Your Account
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-sm">
              Email
            </Label>
            <Input
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-sm">
              Password
            </Label>
            <Input
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your password"
              className="mt-1"
            />
          </div>

          <div className="flex justify-end text-sm">
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <Button type="submit" className="w-full mt-2">
            {mutation.isLoading ? "Logging in..." : "Login"}
          </Button>

          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
