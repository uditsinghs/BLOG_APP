import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { updateProfilePhoto, updateBio } from "@/features/user/userApi"; // <-- your API functions
import { updateUserBio, updateUserPhoto } from "@/features/user/userSlice";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [bio, setBio] = useState(user?.bio || "");
  const [photo, setPhoto] = useState(null);

  const bioMutation = useMutation({
    mutationFn: updateBio,
    onSuccess: (res) => {
      dispatch(updateUserBio(res?.bio));
      toast.success(res?.message || "Bio updated");
    },
    onError: (err) => toast.error(err?.response?.data?.message),
  });

  const photoMutation = useMutation({
    mutationFn: updateProfilePhoto,
    onSuccess: (res) => {
      dispatch(updateUserPhoto(res?.photo));
      toast.success(res?.message || "Photo updated");
    },
    onError: (err) => toast.error(err?.response?.data?.message),
  });

  const handleBioUpdate = () => {
    if (bio !== user?.bio) bioMutation.mutate({ bio, userid: user._id });
  };

  const handlePhotoUpdate = () => {
    if (!photo) return;
    const formData = new FormData();
    formData.append("photo", photo);
    photoMutation.mutate(formData);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Photo */}
          <div className="flex flex-col items-center gap-4">
            <img
              src={user?.photo?.url}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border"
            />
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
            />
            <Button
              onClick={handlePhotoUpdate}
              disabled={photoMutation.isPending}
            >
              {photoMutation.isPending ? "Uploading..." : "Update Photo"}
            </Button>
          </div>

          {/* Profile Info */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="text-base font-medium">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-base font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bio</p>
              <Input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <Button
                className="mt-2"
                onClick={handleBioUpdate}
                disabled={bioMutation.isPending}
              >
                {bioMutation.isPending ? "Saving..." : "Update Bio"}
              </Button>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Posts</p>
              <p className="text-base font-medium">
                {user?.posts?.length || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
