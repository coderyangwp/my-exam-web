<template>
  <div>
    <el-dialog
      :visible="child.visible"
      :title="child.title"
      @close="closeChild"
      width="500px"
    >
      <el-form :model="childForm" ref="childForm" :rules="childRules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="childForm.name" clearable />
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="childForm.code" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('childForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { saveDictChild } from '@/api/system'
import { myMessage } from '@/utils/message'

export default {
  name: 'DictChild',
  props: {
    child: {
      visible: false,
      title: null,
      id: 0,
      dictCode: null,
      name: null,
      code: null
    }
  },
  watch: {
    child: {
      handler(data) {
        if (data.visible && data.id > 0) {
          this.childForm = JSON.parse(JSON.stringify(data))
          delete this.childForm.visible
          delete this.childForm.title
        } else if (data.visible && data.id === 0) {
          // 新增时 需要将字典编码传递给字典项
          this.childForm.dictCode = data.dictCode
        }
      },
      deep: true
    }
  },
  data() {
    return {
      childForm: {
        id: 0,
        dictCode: null,
        name: null,
        code: null
      },
      childRules: {
        name: [{ required: true, message: '请填写名称', trigger: 'blur' }],
        code: [{ required: true, message: '请填写编码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveDictChild(this.childForm).then(res => {
            myMessage()
            this.$emit('closeChild', true)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      // this.$refs[formName].resetFields()
      this.$refs.childForm.clearValidate()
      this.childForm = this.$options.data().childForm
    },
    closeChild() {
      this.resetForm()
      this.$emit('closeChild')
    }
  }
}
</script>

<style scoped>

</style>
