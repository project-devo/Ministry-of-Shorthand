import { RouteSkeleton } from "@/components/feedback/RouteSkeleton";

const AuthLoading = () => {
  return <RouteSkeleton blocks={2} title="Loading auth" />;
};

export default AuthLoading;
