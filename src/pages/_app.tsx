import Layout from "@/components/Layout";
import Login from "@/components/Login";
import { countries } from "@/components/country/Countries";
import "@/styles/globals.css";
import { UserContext, UserDataProps, UserDataValues } from "@/utils/Context";
import { CountryContext, CountryProps, SetCountryAction, initialCountryState } from "@/utils/CountryContext";
import { useAuthentication } from "@/utils/affinidi/hooks/use-authentication";
import type { AppProps } from "next/app";
import { SetStateAction, useEffect, useState } from "react";
import stringSimilarity from "string-similarity";

export default function App({ Component, pageProps }: AppProps) {

  const [userData, setUserData] = useState<UserDataProps>(UserDataValues);
  const [userLoading, setUserLoading] = useState(false);
  const [country, setCountry] = useState<CountryProps>(initialCountryState);

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

  const setAndStoreCountry: SetCountryAction = (newCountry: SetStateAction<CountryProps>) => {
    setCountry((prevState) => {
      const updatedCountry = typeof newCountry === 'function' ? newCountry(prevState) : newCountry;
      localStorage.setItem('country', JSON.stringify(updatedCountry));
      return updatedCountry;
    });
  };

  useEffect(() => {
    if (!userData.userId) return;

    if (userData.user.country) {
      const userCountryName = userData.user.country;

      const matches = stringSimilarity.findBestMatch(
        userCountryName,
        countries.map((c) => c.name)
      );

      const bestMatch = matches.bestMatch;
      const closestCountry = countries.find((c) => c.name === bestMatch.target);

      if (closestCountry) {
        setAndStoreCountry({
          name: closestCountry.name,
          currencySymbol: closestCountry.currencySymbol,
          abbreviation: closestCountry.abbreviation,
          currencyRate: closestCountry.currencyRate,
        });
      }
    } else {
      setAndStoreCountry({
        name: "United States",
        currencySymbol: "$",
        abbreviation: "USD",
        currencyRate: 1,
      });
    }
  }, [userData]);

  return (
    <>
      <UserContext.Provider value={[userData, setUserData]}>
        <CountryContext.Provider value={[country, setCountry]}>
          <Layout>
            {userData.userId ?
              <Component {...pageProps} />
              : <Login userLoading={userLoading} />}
          </Layout>
        </CountryContext.Provider>
      </UserContext.Provider>
    </>
  );
}
