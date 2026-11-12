import PageHeader from "@/components/shop/PageHeader";
import LoginForm from "@/components/account/LoginForm";

export const metadata = { title: "Sign In — My Store" };

export default function LoginPage() {
  return (
    <>
      <PageHeader title="Sign In" crumb="Sign In" />
      <div className="shell py-12">
        <LoginForm />
      </div>
    </>
  );
}
