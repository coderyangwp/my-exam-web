<template>
  <div>
    <el-dialog
      :visible="dict.visible"
      :title="dict.title"
      @close="handlerClose"
      width="600px"
    >
      <el-form :model="dictForm" ref="dictForm" :rules="dictRules" label-width="80px" >
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="dictForm.name" clearable />
        </el-form-item>
        <el-form-item label="字典编码" prop="code">
          <el-tooltip :disabled="dict.id==0" content="使用编辑功能时字典编码无法修改" placement="top" effect="light">
            <el-input v-model="dictForm.code" clearable :disabled="dict.id>0" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="字典描述" prop="descript">
          <el-input v-model="dictForm.descript" clearable />
        </el-form-item>
        <el-form-item label="字典状态" prop="status">
          <el-radio-group v-model="dictForm.status">
            <el-radio :label=1>正常</el-radio>
            <el-radio :label=0>冻结</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('dictForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { saveDict } from '@/api/system'
import { myMessage } from '@/utils/message'

export default {
  name: 'DictDialog',
  props: {
    dict: {
      visible: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: '新增字典'
      },
      id: 0,
      name: null,
      code: null,
      descript: null,
      status: null
    }
  },
  watch: {
    dict: {
      handler(data) {
        if (data.visible && data.id > 0) {
          // 深拷贝 防止data变化导致props变化
          this.dictForm = JSON.parse(JSON.stringify(data))
          // 删除多余属性
          delete this.dictForm.title
          delete this.dictForm.visible
        }
      },
      deep: true
    }
  },
  data() {
    return {
      dictForm: {
        id: 0,
        name: null,
        code: null,
        descript: null,
        status: null
      },
      dictRules: {
        name: [{ required: true, message: '请填写字典名称', trigger: 'blur' }],
        code: [{ required: true, message: '请填写字典编码', trigger: 'blur' }],
        status: [{ required: true, message: '请选择字典状态', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveDict(this.dictForm).then(res => {
            myMessage()
            this.resetForm('dictForm')
            this.$emit('closeDict', true)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.dictForm = this.$options.data().dictForm
    },
    handlerClose() {
      this.resetForm('dictForm')
      this.$emit('closeDict')
    }
  }
}
</script>

<style scoped>

</style>
