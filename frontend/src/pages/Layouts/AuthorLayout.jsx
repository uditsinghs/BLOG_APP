import { Link, Outlet } from "react-router-dom";

const AuthorLayout = () => {
  return (
    <div className="flex">
      <aside className="w-1/4 p-4 border-r h-full">
        <nav>
          <div>
            <Link to="/author">Dashboard</Link>
          </div>
          <div>
            <Link to="/author/blog/create">Create Blog</Link>
          </div>
        </nav>
      </aside>
      <main className="w-3/4 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthorLayout;
