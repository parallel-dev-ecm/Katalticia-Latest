import { useNavigate, Outlet } from "react-router-dom";
import React from "react";
import { useAuthStore } from "stores/Store_Auth";

export default function PrivateRoute() {
  let navigate = useNavigate();
  const authenticated = useAuthStore((state) => state.isAuthenticated);
  if (!authenticated) {
    navigate("/authentication/sign-in/cover");
    return null;
  }

  return <Outlet />;
}
