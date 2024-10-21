<script lang="ts">
  import styles from "client-css/m/status.module.scss";

  type Props = {
    error?: boolean;
    fetching?: boolean;
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const {
    fetching,
    error,
  }: Props = $props();
</script>

<div class="{styles.bar}{fetching ? ` ${styles.busy}` : ""}{error ? ` ${styles.error}` : ""}"></div>
