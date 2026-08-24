import type { Metadata } from "next";
import { SignInButton } from "./sign-in-button";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <section className="flex justify-center items-center mb-20">
      <SignInButton />
    </section>
  );
}
