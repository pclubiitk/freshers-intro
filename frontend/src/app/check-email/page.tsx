// pages/check-email.tsx
import { useRouter } from "next/router";

export default function CheckEmailPage() {
  const router = useRouter();
  const email = router.query.email;

  return (
    <div className="centered-box">
      <h2>🎉 Signup Successful</h2>
      <p>We&#180;ve sent a verification link to <strong>{email}</strong>.</p>
      <p>Please check your inbox to activate your account.</p>
    </div>
  );
}
