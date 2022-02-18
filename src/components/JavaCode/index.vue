<template>
  <div class="app-container">
    <codemirror
      ref="genCodeMirror"
      :value="value"
      :options="cmOptions"
    />
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/idea.css'
import 'codemirror/mode/clike/clike'

export default {
  name: 'JavaCode',
  components: {
    codemirror
  },
  props: {
    value: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      cmOptions: {
        tabSize: 2, // tab的空格个数
        theme: 'idea', // 主题样式
        lineNumbers: true, // 是否显示行数
        lineWrapping: true, // 是否自动换行
        styleActiveLine: true, // line选择是是否加亮
        matchBrackets: true, // 括号匹配
        mode: 'text/x-java', // 实现javascript代码高亮
        readOnly: false // 只读
      }
    }
  },
  mounted() {
    const height = document.documentElement.clientHeight - 200 + 'px'
    this.$refs.genCodeMirror.codemirror.setSize('auto', height)
  }
}
</script>

<style scoped>
</style>
