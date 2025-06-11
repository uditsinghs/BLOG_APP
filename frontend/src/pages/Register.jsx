import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/features/user/userApi";
import { toast } from "sonner";

const Register = () => {
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
  };
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success(data?.message || "Regsiter successfully");
      setInput({
        name: "",
        email: "",
        password: "",
        role: "",
      });
      navigate("/login");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Error in registering");
    },
  });

  const handleRoleChange = (value) => {
    setInput((prev) => ({
      ...prev,
      role: value,
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    mutation.mutate({ userData: input });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 via-white to-blue-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Create an Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name */}
          <div>
            <Label htmlFor="name" className="text-sm">
              Name
            </Label>
            <Input
              name="name"
              value={input.name}
              onChange={handleChange}
              type="text"
              placeholder="Enter your name"
              className="mt-1"
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-sm">
              Email
            </Label>
            <Input
              name="email"
              value={input.email}
              onChange={handleChange}
              type="email"
              placeholder="Enter your email"
              className="mt-1"
            />
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password" className="text-sm">
              Password
            </Label>
            <Input
              name="password"
              value={input.password}
              onChange={handleChange}
              type="password"
              placeholder="Create a password"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="role" className="text-sm">
              Select Role
            </Label>
            <Select value={input.role} onValueChange={handleRoleChange}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="author">Author</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full mt-2"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Registering..." : "Register"}
          </Button>
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
