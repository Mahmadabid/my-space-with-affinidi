import { Provider } from "next-auth/providers/index";
import { providerClientId, providerClientSecret, providerIssuer } from "../secrets";

export const PROVIDER_ATTRIBUTES_KEY = "custom";

export const provider: Provider = {
  id: "affinidi",
  name: "Affinidi",
  clientId: providerClientId,
  clientSecret: providerClientSecret,
  type: "oauth",
  wellKnown: `${providerIssuer}/.well-known/openid-configuration`,
  authorization: {
    params: {
      prompt: "login",
      scope: "openid offline_access",
    },
  },
  client: {
    token_endpoint_auth_method: "client_secret_post",
  },
  idToken: true,
  profile(profile: { sub: string; custom: any[] }) {
    return {
      id: profile.sub,
      email: profile.custom?.find((i: any) => typeof i.email === "string")?.email,
      familyName: profile.custom?.find((i: any) => typeof i.familyName === "string")?.familyName,
      givenName: profile.custom?.find((i: any) => typeof i.givenName === "string")?.givenName,
      middleName: profile.custom?.find((i: any) => typeof i.middleName === "string")?.middleName,
      picture: profile.custom?.find((i: any) => typeof i.picture === "string")?.picture,
      country: profile.custom?.find((i: any) => typeof i.country === "string")?.country,
      nickname: profile.custom?.find((i: any) => typeof i.nickname === "string")?.nickname,
      phoneNumber: profile.custom?.find((i: any) => typeof i.phoneNumber === "string")?.phoneNumber,
      gender: profile.custom?.find((i: any) => typeof i.gender === "string")?.gender,
      birthdate: profile.custom?.find((i: any) => typeof i.birthdate === "string")?.birthdate,
      livenessCheckPassed: profile.custom?.find((i: any) => typeof i.livenessCheckPassed === "string")?.livenessCheckPassed,
      postalCode: profile.custom?.find((i: any) => typeof i.postalCode === "string")?.postalCode,
      locality: profile.custom?.find((i: any) => typeof i.locality === "string")?.locality,
      formatted: profile.custom?.find((i: any) => typeof i.formatted === "string")?.formatted,
    };
  },
};
