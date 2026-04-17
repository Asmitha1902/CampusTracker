import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CampusAuth from "./pages/CampusAuth";
import AdminLogin from "./pages/AdminLogin"; 
import AdminDashboard from "./pages/AdminDashboard";
import ApprovePosts from "./pages/ApprovePosts";
import StudentDashboard from "./pages/StudentDashboard";
import BrowseItems from "./pages/BrowseItems";
import LostFound from "./pages/LostFound";
import SidebarLayout from "./pages/SidebarLayout";
import AdminSidebarLayout from "./pages/AdminSidebarLayout";
import Profile from "./pages/Profile";
import MyPosts from "./pages/MyPosts";
import Notifications from "./pages/Notifications";
import Chat from "./pages/Chat";
import ManageUsers from "./pages/ManageUsers";
import Reports from "./pages/Reports";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Home & Auth */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<CampusAuth />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* Student Layout */}
      <Route element={<SidebarLayout />}>
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/browse" element={<BrowseItems />} />
        <Route path="/lostfound" element={<LostFound />} />
                <Route path="/my-posts" element={<MyPosts />} />
                 <Route path="/profile" element={<Profile />} />
                 <Route path="/notifications" element={<Notifications />} />
                 <Route path="/chat" element={<Chat />} />
      </Route>

      {/* Admin Layout */}
      <Route path="/admin-dashboard" element={<AdminSidebarLayout />}>
        <Route index element={<AdminDashboard />} />         {/* /admin-dashboard */}
        <Route path="approve-posts" element={<ApprovePosts />} /> {/* /admin-dashboard/approve-posts */}
        <Route path="/admin-dashboard/manage-users" element={<ManageUsers />} />

<Route path="/admin-dashboard/reports" element={<Reports />} />
       
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<h2>Page Not Found</h2>} />
    </Routes>
  );
};

export default AppRoutes;