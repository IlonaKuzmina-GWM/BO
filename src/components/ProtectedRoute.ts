import { useRouter } from "next/navigation";
import { useContext, useEffect, ReactNode } from "react";
import UserContext from "../context/UserContext";

interface IProtectedRoute {
  allowedRoles: string[];
  children: ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: IProtectedRoute) => {
  const userContext = useContext(UserContext); // Get the full context object
  const router = useRouter();

  useEffect(() => {
    if (!userContext || !userContext.userRole || !allowedRoles.includes(userContext.userRole)) {
      // Redirect to the home page if the user doesn't have access
      router.push("/");
    }
  }, [userContext, allowedRoles, router]);

  console.log("userContext", userContext);

  if (!userContext || !userContext.userRole || !allowedRoles.includes(userContext.userRole)) {
    return null; // Or a loading indicator while checking role
  }

  return children;
};

export default ProtectedRoute;
