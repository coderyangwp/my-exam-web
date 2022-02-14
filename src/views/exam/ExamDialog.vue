<template>
  <div class="app-container">
    <el-dialog :title="examInfo.title" :visible="examInfo.visible" width="840px" @close="handleClose(false)">
      <el-form ref="examForm" :model="examForm" :rules="examRules" label-width="auto" :inline="true">
        <el-row>
          <el-col :span="24">
            <el-form-item label="考试名称" prop="name" class="exam-title">
              <el-input v-model="examForm.name" placeholder="请填写考试名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <template v-for="(domain, index) in examForm.examArrangeList">
          <el-form-item :key="index + 'examDate'" :label="'第' + (index+1) + '场考试'"
            :prop="'examArrangeList.' + index + '.examDate'"
            :rules="{required: true, message: '考试时间不能为空', trigger: 'blur'}">
            <el-date-picker v-model="domain.examDate" type="date" placeholder="选择考试日期" />
          </el-form-item>
          <el-form-item :key="index + 'startTime'" label="" :prop="'examArrangeList.' + index + '.startTime'"
            :rules="{required: true, message: '考试开始时间不能为空', trigger: 'blur'}">
            <el-time-select v-model="domain.startTime" placeholder="开始时间" :picker-options="{
                start: '10:00',
                step: '00:30',
                end: '18:30'
              }" />
          </el-form-item>
          <el-form-item :key="index + 'endTime'" label="" :prop="'examArrangeList.' + index + '.endTime'"
            :rules="{required: true, message: '考试结束时间不能为空', trigger: 'blur'}">
            <el-time-select v-model="domain.endTime" placeholder="结束时间" :picker-options="{
                start: '10:00',
                step: '00:30',
                end: '18:30',
                minTime: domain.startTime
              }" />
          </el-form-item>
          <span :key="index + 'button'" class="arrange-button">
            <i v-if="index === 0" class="el-icon-circle-plus" @click.prevent="addArrange()" />
            <i v-else class="el-icon-remove" @click.prevent="removeArrange(domain)" />
          </span>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { saveExamInfo } from '@/api/exam.js'
  import { myMessage } from '@/utils/message'

  export default {
    name: 'ExamDialog',
    props: {
      examInfo: {
        type: Object,
        default: () => ({}),
        title: {
          type: String,
          required: true
        },
        visible: {
          type: Boolean,
          default: false
        },
        id: {
          type: Number,
          default: 0
        },
        name: {
          type: String,
          required: true
        },
        year: {
          type: String,
          required: true
        },
        month: {
          type: String,
          required: true
        },
        status: {
          type: String,
          required: true
        },
        examArrangeList: {
          type: Array,
          required: false
        }
      }
    },
    data() {
      return {
        examForm: {
          id: 0,
          name: null,
          year: null,
          month: null,
          status: null,
          examArrangeList: [
            {
              id: 0,
              examId: null,
              examDate: null,
              startTime: null,
              endTime: null
            }
          ]
        },
        examRules: {
          name: [{ required: true, message: '考试名称不能为空', trigger: 'blur' }]
        }
      }
    },
    watch: {
      examInfo: {
        handler(data) {
          if (data.visible && data.id > 0) {
            // 当data中包含二级属性时，使用Object.assign为钱拷贝，修改examForm的值会导致数据重新渲染，修改数据被还原
            this.examForm = JSON.parse(JSON.stringify(data))
          }
        },
        deep: true
      }
    },
    methods: {
      removeArrange(item) {
        var index = this.examForm.examArrangeList.indexOf(item)
        if (index !== -1) {
          this.examForm.examArrangeList.splice(index, 1)
        }
      },
      addArrange() {
        this.examForm.examArrangeList.push({
          examDate: null,
          startTime: null,
          endTime: null
        })
      },
      submitForm(formName) {
        this.$refs.examForm.validate((valid) => {
          if (valid) {
            saveExamInfo(this.examForm).then((res) => {
              myMessage()
              this.handleClose(true)
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      handleClose(reload) {
        // 不使用resetFields方法，因为对于数组元素无法清空
        this.$refs['examForm'].clearValidate()
        Object.assign(this.examForm, this.$options.data().examForm)
        this.$emit('closeExamDialog', { reload: reload })
      }
    }
  }
</script>

<style scoped>
  .exam-title {
    width: 100%;
  }

  /deep/.exam-title .el-form-item__content {
    width: 84% !important;
  }

  .el-input {
    width: 100%;
  }

  .arrange-button {
    margin-left: 5px;
    line-height: 40px;
  }

  .arrange-button .el-icon-circle-plus {
    font-size: 18px;
  }

  .arrange-button .el-icon-remove {
    font-size: 18px;
  }
</style>