import Layout from "@/components/Layout";
import Login from "@/components/log/Login";
import "@/styles/globals.css";
import { UserContext, UserDataProps, UserDataValues } from "@/utils/Context";
import { useAuthentication } from "@/utils/affinidi/hooks/use-authentication";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {

  const [userData, setUserData] = useState<UserDataProps>(UserDataValues);

  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = await useAuthentication();
      console.log(userInfo, 'aaaaaaaa')
      setUserData(prev => ({
        ...prev,
        userId: userInfo.userId,
        user: userInfo.user
      }));
    }

    fetchUser();
  }, []);

  return (
    <>
      <UserContext.Provider value={[userData, setUserData]}>
        <Layout>
          {userData.userId ?
            <Component {...pageProps} />
            : <Login />}
        </Layout>
      </UserContext.Provider>
    </>
  );
}
