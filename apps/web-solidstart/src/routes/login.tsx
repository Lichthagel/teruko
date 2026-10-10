import { Title } from "@solidjs/meta";
import { A, useLocation } from "@solidjs/router";
import styles from "client-css/m/login.module.scss";

export default function Login() {
  const location = useLocation();
  const returnTo = () => new URLSearchParams(location.search).get("returnTo") ?? "/";
  const loginUrl = () => `/auth/login?returnTo=${encodeURIComponent(returnTo())}`;

  return (
    <main class={styles.page}>
      <Title>Sign in - てる子</Title>
      <div class={styles.eyebrow}>てる子 / Pixiv archive</div>
      <h1 class={styles.title}>A quieter way to browse.</h1>
      <p class={styles.intro}>Sign in with your organization account to continue to the illustration archive.</p>
      <section class={styles.card} aria-labelledby="signin-title">
        <h2 id="signin-title" class={styles.cardTitle}>Welcome back</h2>
        <p class={styles.cardText}>Your collection is waiting. Authentication is handled securely by your organization.</p>
        <A class={styles.button} href={loginUrl()}>Continue with Authentik</A>
      </section>
    </main>
  );
}
