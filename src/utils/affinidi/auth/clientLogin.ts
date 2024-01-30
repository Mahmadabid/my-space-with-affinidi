import { signIn } from "next-auth/react";
import { hostUrl } from "../variables";

export async function clientLogin() {
  await signIn("affinidi", { callbackUrl: hostUrl });
}
