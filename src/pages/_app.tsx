import Layout from "@/components/Layout";
import Login from "@/components/Login";
import "@/styles/globals.css";
import { UserContext, UserDataProps, UserDataValues } from "@/utils/Context";
import { CountryProvider } from "@/utils/CountryContext";
import { useAuthentication } from "@/utils/affinidi/hooks/use-authentication";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {

  const [userData, setUserData] = useState<UserDataProps>(UserDataValues);
  const [userLoading, setUserLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setUserLoading(true);
      const userInfo = await useAuthentication();

      setUserData(prev => ({
        ...prev,
        userId: userInfo.userId,
        user: userInfo.user
      }));
      setUserLoading(false);
    }

    fetchUser();
  }, []);

  return (
    <>
      <UserContext.Provider value={[userData, setUserData]}>
        <CountryProvider>
          <Layout>
            {userData.userId ?
              <Component {...pageProps} />
              : <Login userLoading={userLoading} />}
          </Layout>
        </CountryProvider>
      </UserContext.Provider>
    </>
  );
}
