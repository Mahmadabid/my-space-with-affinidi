import Layout from "@/components/Layout";
import Login from "@/components/Login";
import { countries } from "@/components/country/Countries";
import "@/styles/globals.css";
import { UserContext, UserDataProps, UserDataValues } from "@/utils/Context";
import { CountryContext, CountryProvider } from "@/utils/CountryContext";
import { useAuthentication } from "@/utils/affinidi/hooks/use-authentication";
import type { AppProps } from "next/app";
import { useContext, useEffect, useState } from "react";
import stringSimilarity from "string-similarity";

export default function App({ Component, pageProps }: AppProps) {

  const [userData, setUserData] = useState<UserDataProps>(UserDataValues);
  const [userLoading, setUserLoading] = useState(false);
  const [switchCountry, setSwitchCountry] = useState(0);
  const [country, setCountry] = useContext(CountryContext);

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

  
  useEffect(() => {
    const fetchCountry = localStorage.getItem('country');
    if (fetchCountry) {
        setSwitchCountry(2);
    } else {
        setSwitchCountry(1);
    }
}, []);

useEffect(() => {
    if (switchCountry !== 1) return;

    if (userData.user.country) {
        const userCountryName = userData.user.country;

        const matches = stringSimilarity.findBestMatch(
            userCountryName,
            countries.map((c) => c.name)
        );

        const bestMatch = matches.bestMatch;
        const closestCountry = countries.find((c) => c.name === bestMatch.target);

        if (closestCountry) {
            setCountry({
                name: closestCountry.name,
                currencySymbol: closestCountry.currencySymbol,
                abbreviation: closestCountry.abbreviation,
                currencyRate: closestCountry.currencyRate,
            });
        }
    } else {
        setCountry({
            name: "United States",
            currencySymbol: "$",
            abbreviation: "USD",
            currencyRate: 1,
        });
    }
}, [userData, switchCountry]);

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
