import PageHeader from "@/components/shop/PageHeader";
import RegisterForm from "@/components/account/RegisterForm";
import { getWelcomeCode } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Create Account — My Store" };

export default async function RegisterPage() {
  const welcomeCode = await getWelcomeCode();

  return (
    <>
      <PageHeader title="Create Account" crumb="Register" />
      <div className="shell py-12">
        <RegisterForm welcomeCode={welcomeCode} />
      </div>
    </>
  );
}
