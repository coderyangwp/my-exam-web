<template>
  <div class="app-container" />
</template>

<script>
export default {
  name: 'Preview',
  data() {
    return {}
  },
  created() {
    this.$route.params.tableName
  },
  // 方法集合
  methods: {}
}
</script>

<style scoped>
</style>
