<template>
  <div>
    <el-dialog
      :title="dialog.title"
      :visible="dialog.visible"
      @close="handlerClose(false)"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="课程名称"
          prop="name"
        >
          <el-input
            v-model="ruleForm.name"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="课程代码"
          prop="code"
        >
          <el-tooltip
            :disabled="dialog.id === 0"
            content="使用编辑功能时专业代码无法修改"
            placement="top"
            effect="light"
          >
            <el-input
              v-model="ruleForm.code"
              :disabled="dialog.id>0"
              clearable
            />
          </el-tooltip>
        </el-form-item>
        <el-form-item
          label="学分"
          prop="score"
        >
          <el-input
            v-model="ruleForm.score"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="课程状态"
          prop="status"
        >
          <el-radio-group v-model="ruleForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">不启用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
          >提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { saveCourse } from '@/api/major'
import { myMessage } from '@/utils/message'

export default {
  name: 'CourseDialog',
  props: {
    dialog: {
      type: Object,
      default: () => ({}),
      id: {
        type: Number,
        default: 0
      },
      title: {
        type: String,
        default: ''
      },
      visible: {
        type: Boolean,
        default: false
      },
      name: {
        type: String,
        default: ''
      },
      code: {
        type: Boolean,
        default: false
      },
      score: {
        type: Boolean,
        default: false
      },
      status: {
        type: Boolean,
        default: false
      }
    }
  },
  data() {
    return {
      ruleForm: {
        name: '',
        code: '',
        score: '',
        status: '',
        id: 0
      },
      rules: {
        name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
        code: [
          { required: true, message: '请输入课程代码', trigger: 'change' },
          { min: 5, max: 5, message: '课程代码长度为5', trigger: 'blur' }
        ],
        level: [{ required: true, message: '请选择课程学分', trigger: 'blur' }],
        status: [{ required: true, message: '请选择课程状态', trigger: 'blur' }]
      }
    }
  },
  watch: {
    dialog: {
      handler(data) {
        if (data.visible && data.id > 0) {
          Object.assign(this.ruleForm, data)
        }
      },
      deep: true
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveCourse(this.ruleForm).then((response) => {
            myMessage()
            this.handlerClose(true)
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
    handlerClose(reload) {
      this.resetForm('ruleForm')
      Object.assign(this.$data.ruleForm, this.$options.data().ruleForm)
      this.$emit('closeDialog', { reload: reload })
    }
  }
}
</script>
