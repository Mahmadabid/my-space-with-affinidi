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
  profile(profile: { sub: string; custom: {email: string}[]; }) {
    return {
      id: profile.sub,
      email: profile.custom?.find((i: any) => typeof i.email === "string")
        ?.email,
    };
  },
};
