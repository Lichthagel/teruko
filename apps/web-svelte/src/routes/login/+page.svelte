<script lang="ts">
  import styles from "client-css/m/login.module.scss";

  type Props = { data: { returnTo: string } };
  const { data }: Props = $props();

  const loginUrl = $derived(`/auth/login?returnTo=${encodeURIComponent(data.returnTo)}`);
</script>

<svelte:head>
  <title>Sign in - てる子</title>
</svelte:head>

<main class={styles.page}>
  <div class={styles.eyebrow}>てる子 / Pixiv archive</div>
  <h1 class={styles.title}>A quieter way to browse.</h1>
  <p class={styles.intro}>Sign in with your organization account to continue to the illustration archive.</p>
  <section class={styles.card} aria-labelledby="signin-title">
    <h2 id="signin-title" class={styles.cardTitle}>Welcome back</h2>
    <p class={styles.cardText}>Your collection is waiting. Authentication is handled securely by your organization.</p>
    <a class={styles.button} href={loginUrl}>Continue with Authentik</a>
  </section>
</main>
