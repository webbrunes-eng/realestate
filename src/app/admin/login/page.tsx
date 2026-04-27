import { getDict } from "@/lib/i18n";
import { LoginForm } from "./login-form";

export default async function AdminLoginPage() {
  const { dict, locale } = await getDict();
  return <LoginForm dict={dict.admin} locale={locale} />;
}
