<script lang="ts">
  import styles from "client-css/m/checkbox.module.scss";

  let {
    value: checked = $bindable(),
    label,
  } = $props<{
    checked: boolean;
    label: string;
  }>();
</script>

<label class={styles.checkbox}>
  <input type="checkbox" bind:checked={checked} />
  <span class={styles.checkmark}></span>
  <span>{label}</span>
</label>
