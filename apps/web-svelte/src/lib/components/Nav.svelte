<script lang="ts">
  import styles from "client-css/m/nav.module.scss";
  import Plus from "lucide-svelte/icons/plus";
</script>

<div class={styles.bar}>
  <div class="container {styles.content}">
    <div class={styles.left}>
      <a class={styles.button} href="/">てる子</a>
    </div>
    <div>
      <a class="{styles.button} {styles.square}" href="/new">
        <Plus />
      </a>
    </div>
  </div>
</div>
