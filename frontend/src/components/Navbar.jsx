import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "@/features/user/userApi";
import { toast } from "sonner";
import { logout } from "@/features/user/userSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  console.log(user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      dispatch(logout());
      setIsOpen(false);
      toast.success(data?.message);
      navigate("/login");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Logout failed");
    },
  });

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold"
      : "text-gray-700 hover:text-blue-600 font-medium transition-colors";

  return (
    <header className="w-full shadow-md fixed top-0 left-0 bg-white z-50 h-16">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-full">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          MySite
        </Link>

        {/* Desktop Nav */}

        {/* Normal user navlinks */}
        <nav className="hidden md:flex space-x-6 items-center">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/blogs" className={navLinkClass}>
            Blogs
          </NavLink>

          {/* Author Navlinks */}

          <DropdownMenu>
            <DropdownMenuTrigger className="font-bold">
              {user?.name}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuSeparator />
              {user?.role === "author" && (
                <>
                  <DropdownMenuItem>
                    <NavLink to="/author" className={navLinkClass}>
                      Dashboard
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <NavLink to="/profile" className={navLinkClass}>
                      Profile
                    </NavLink>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => mutation.mutate()}
                disabled={mutation.isLoading}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center gap-1"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <NavLink to="/login" className={navLinkClass}>
              Login
            </NavLink>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col gap-4 mt-6 ml-14 text-xl">
                <NavLink
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className={navLinkClass}
                >
                  Home
                </NavLink>
                <NavLink
                  to="/blogs"
                  onClick={() => setIsOpen(false)}
                  className={navLinkClass}
                >
                  Blogs
                </NavLink>
                {user?.role === "author" && (
                  <>
                    <NavLink
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className={navLinkClass}
                    >
                      Profile
                    </NavLink>
                    <NavLink
                      to="/author"
                      onClick={() => setIsOpen(false)}
                      className={navLinkClass}
                    >
                      Dashboard
                    </NavLink>
                  </>
                )}
                {isAuthenticated && user ? (
                  <button
                    onClick={() => mutation.mutate()}
                    disabled={mutation.isLoading}
                    className="text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center gap-1"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                ) : (
                  <NavLink
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className={navLinkClass}
                  >
                    Login
                  </NavLink>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
