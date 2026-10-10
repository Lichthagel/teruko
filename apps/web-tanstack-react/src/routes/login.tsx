import { createFileRoute } from "@tanstack/react-router";
import styles from "client-css/m/login.module.scss";

const Login = () => {
  const { returnTo } = Route.useLoaderData();
  const loginUrl = `/auth/login?returnTo=${encodeURIComponent(returnTo)}`;

  return (
    <main className={styles.page}>
      <div className={styles.eyebrow}>てる子 / Pixiv archive</div>
      <h1 className={styles.title}>A quieter way to browse.</h1>
      <p className={styles.intro}>Sign in with your organization account to continue to the illustration archive.</p>
      <section className={styles.card} aria-labelledby="signin-title">
        <h2 id="signin-title" className={styles.cardTitle}>Welcome back</h2>
        <p className={styles.cardText}>Your collection is waiting. Authentication is handled securely by your organization.</p>
        <a className={styles.button} href={loginUrl}>Continue with Authentik</a>
      </section>
    </main>
  );
};

export const Route = createFileRoute("/login")({
  loader: ({ location }) => ({ returnTo: new URLSearchParams(location.searchStr).get("returnTo") ?? "/" }),
  head: () => ({ meta: [{ title: "Sign in - てる子" }] }),
  component: Login,
});
