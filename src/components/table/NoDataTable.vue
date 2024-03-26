<template>
  <tr>
    <td :colspan="colspan">
      <h6 class="text-center">Data tidak Ada</h6>
    </td>
  </tr>
</template>


<script>
export default {
  name: "NoDataTable",
  props: {
    colspan: {
      type: Number,
      default: 1
    }
  }
}
</script>
