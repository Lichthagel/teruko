<script lang="ts">
  import styles from "client-css/m/status.module.scss";

  export let fetching: boolean;
  export let error: boolean;
</script>

<div class="{styles.bar}{fetching ? ` ${styles.busy}` : ""}{error ? ` ${styles.error}` : ""}" />
