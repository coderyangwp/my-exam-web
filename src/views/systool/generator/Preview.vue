<template>
  <div class="app-container">
    <el-card
      :body-style="{padding: '0px'}"
      shadow="never"
    >
      <el-tabs
        v-model="activeName"
        type="card"
      >
        <el-tab-pane
          v-for="code in previewCode"
          :key="code.name"
          :lazy="true"
          :label="code.name"
          :name="code.name"
        >
          <java-code :value="code.content" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { preview } from '@/api/systool'
import JavaCode from '@/components/JavaCode/index.vue'

export default {
  name: 'Preview',
  components: {
    JavaCode
  },
  data() {
    return {
      activeName: 'Entity',
      previewCode: []
    }
  },
  created() {
    this.init(this.$route.params.tableName)
    preview
  },
  // 方法集合
  methods: {
    init(tableName) {
      preview(tableName).then((r) => {
        this.previewCode = r.data
      })
    }
  }
}
</script>

<style scoped>
</style>
