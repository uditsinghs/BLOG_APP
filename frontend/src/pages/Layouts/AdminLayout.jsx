import React from "react";
import { Link, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex h-full">
      <nav className="w-1/4 p-4 border-r">
        <div>
          <Link to="/admin">Dashboard</Link>
        </div>
      </nav>
      <div className='className="w-3/4 p-4"'>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
