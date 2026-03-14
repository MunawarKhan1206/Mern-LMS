import { useState, useEffect } from "react";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await API.get("/users/profile");
      setProfile(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading profile...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>👤 My Profile</h1>
        <p>Your account information</p>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          {profile?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="profile-details">
          <div className="profile-field">
            <label>Full Name</label>
            <p>{profile?.name}</p>
          </div>
          <div className="profile-field">
            <label>Email Address</label>
            <p>{profile?.email}</p>
          </div>
          <div className="profile-field">
            <label>Role</label>
            <p className="role-badge">{profile?.role}</p>
          </div>
          <div className="profile-field">
            <label>Member Since</label>
            <p>{new Date(profile?.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
