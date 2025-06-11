import { fetchUserProfile } from "@/features/user/userSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Home = () => {
  const disPatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (user?.role === "admin") {
      window.location.href = "/admin";
    }
    if (!user && !isAuthenticated) {
      window.location.href = "/login";
    }
    disPatch(fetchUserProfile());
  }, [disPatch]);
  return (
    <div>
      <h1>HELLO</h1>
    </div>
  );
};

export default Home;
