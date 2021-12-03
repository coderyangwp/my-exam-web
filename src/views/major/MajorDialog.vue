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
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="专业代码" prop="code">
          <el-input v-model="ruleForm.code"></el-input>
        </el-form-item>
        <el-form-item label="专业层次" prop="level">
          <el-radio-group v-model="ruleForm.level">
            <el-radio :label="5">本科</el-radio>
            <el-radio :label="6">专科</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="专业状态" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio :label="0">启用</el-radio>
            <el-radio :label="1">不启用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { addMajor, majorDetail } from '@/api/major'

export default {
  name: 'MajorDialog',
  props: {
    title: null,
    visible: null,
    code: null
  },
  data() {
    return {
      ruleForm: {
        name: '',
        code: '',
        level: '',
        status: ''
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
    code() {
      this.init()
    }
  },
  methods: {
    init() {
      majorDetail(this.code).then(res => {
        this.ruleForm = res.data
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addMajor(this.ruleForm).then(response => {
            this.$emit('finishSave')
          })
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
    }
  }
}
</script>
