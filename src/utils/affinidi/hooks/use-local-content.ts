import { useAuthentication } from "./use-authentication";

export const useLocalContent = () => {
  const { isAuthenticated, user } = useAuthentication();

  return {
    country: isAuthenticated && user?.country,
  };
};
