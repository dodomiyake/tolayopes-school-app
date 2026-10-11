import { Crest } from "@/components/crest";
import { school } from "@/lib/school";
import { SignIn } from "./sign-in";

export default function SignInPage() {
  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <section className="flex flex-col items-center gap-3 rounded-b-[32px] bg-brand px-6 pt-12 pb-16 text-center lg:w-[44%] lg:justify-center lg:rounded-none lg:p-12">
        <span className="lg:hidden">
          <Crest size={104} />
        </span>
        <span className="hidden lg:block">
          <Crest size={168} />
        </span>
        <h1 className="mt-2 text-[26px] font-extrabold tracking-wide text-white lg:mt-4 lg:text-4xl">
          {school.shortName.toUpperCase()}
        </h1>
        <p className="text-sm text-sun italic lg:text-lg">{school.motto}</p>
        <p className="mt-6 hidden text-sm leading-relaxed text-lime-200 lg:block">
          {school.sections}
          <br />
          {school.address}
        </p>
      </section>

      <section className="flex flex-1 flex-col lg:items-center lg:justify-center lg:p-12">
        <div className="mx-5 -mt-8 rounded-[20px] bg-white p-6 shadow-sm sm:mx-auto sm:w-full sm:max-w-md lg:mt-0 lg:bg-transparent lg:p-0 lg:shadow-none">
          <h2 className="mb-1 text-xl font-bold lg:text-3xl lg:font-extrabold">Welcome back</h2>
          <p className="mb-5 hidden text-muted lg:block">Sign in to see attendance, fees and results.</p>
          <SignIn />
        </div>
        <p className="mx-6 mt-auto pt-8 pb-7 text-center text-xs leading-relaxed text-muted lg:mt-6 lg:pb-0">
          <span className="lg:hidden">
            {school.address}
            <br />
          </span>
          Need help? Call the school office: {school.phone}
        </p>
      </section>
    </div>
  );
}
