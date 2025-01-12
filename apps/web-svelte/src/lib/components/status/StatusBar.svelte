<script lang="ts">
  import styles from "client-css/m/status.module.scss";

  type Props = {
    error?: boolean;
    fetching?: boolean;
  };

  const {
    fetching,
    error,
  }: Props = $props();
</script>

<!-- eslint-disable-next-line @stylistic/quotes -->
<div class="{styles.bar}{fetching ? ` ${styles.busy}` : ''}{error ? ` ${styles.error}` : ''}"></div>
