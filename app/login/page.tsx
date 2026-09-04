import Link from "next/link";
import { LogoWordmark } from "@/components/logo";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
        <Link href="/">
          <LogoWordmark light />
        </Link>
        <h1 className="mt-8 text-3xl font-semibold">Open the Relay demo.</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          One click opens a ready workspace. Then press the big button on Home.
        </p>
        <div className="mt-6 rounded-2xl border border-white/10 bg-[#121a2b] p-5">
          <LoginForm error={error} />
        </div>
      </div>
    </div>
  );
}
