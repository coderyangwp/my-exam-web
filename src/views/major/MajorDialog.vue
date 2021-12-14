<template>
  <div>
    <el-dialog
      :title="title"
      :visible="visible"
      v-if="visible"
      @close="handlerClose"
    >
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="专业名称" prop="name">
          <el-input v-model="ruleForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="专业代码" prop="code">
          <el-tooltip :disabled="id==0" content="使用编辑功能时专业代码无法修改" placement="top" effect="light">
            <el-input v-model="ruleForm.code" :disabled="id>0" clearable></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="专业层次" prop="level">
          <el-radio-group v-model="ruleForm.level">
            <el-radio :label="5">本科</el-radio>
            <el-radio :label="6">专科</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="专业状态" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio :label=1>启用</el-radio>
            <el-radio :label=0>不启用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { addMajor, updateMajor, majorDetail } from '@/api/major'
import { handlerMessage, handlerNotification } from '@/utils/message'

export default {
  name: 'MajorDialog',
  props: {
    id: {
      type: Number,
      default: 0
    },
    title: null,
    visible: null
  },
  data() {
    return {
      ruleForm: {
        name: '',
        code: '',
        level: '',
        status: '',
        id: 0
      },
      rules: {
        name: [
          { required: true, message: '请输入专业名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入专业代码', trigger: 'change' },
          { min: 6, max: 6, message: '专业代码长度为6', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '请选择专业层次', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择专业状态', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    id(val) {
      if (val > 0) {
        this.init()
        this.ruleForm.id = val
      }
    }
  },
  methods: {
    init() {
      majorDetail(this.id).then(res => {
        this.ruleForm = res.data
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.id === 0) {
            addMajor(this.ruleForm).then(response => {
              handlerMessage()
              this.$emit('finishSave')
              this.clearForm()
            })
          } else {
            updateMajor(this.ruleForm).then(response => {
              handlerNotification()
              this.$emit('finishSave')
              this.clearForm()
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handlerClose() {
      this.clearForm()
      this.$emit('closeDialog')
    },
    clearForm() {
      this.ruleForm.code = ''
      this.ruleForm.name = ''
      this.ruleForm.level = ''
      this.ruleForm.status = ''
      this.ruleForm.id = 0
    }
  }
}
</script>
