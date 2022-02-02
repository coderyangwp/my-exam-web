<template>
  <div class='app-container'>
    <el-dialog 
      :title="examInfo.title"
      :visible="examInfo.visible"
      width="820px"
      @close="handleClose(false)"
      >
      <el-form :model="examForm" ref="examForm" :rules="examRules" label-width="auto" :inline="true">
        <el-row>
          <el-col :span="24">
            <el-form-item label="考试名称" prop="name" class="exam-title">
              <el-input v-model="examForm.name" placeholder="请填写考试名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <template v-for="(domain, index) in examForm.examArrangeList">
          <el-form-item
            :label="'第' + (index+1) + '场考试'"
            :prop="'examArrangeList.' + index + '.examDate'"
            :rules="{required: true, message: '考试时间不能为空', trigger: 'blur'}"
            :key="index + 'examDate'"
          >
            <el-date-picker
              v-model="domain.examDate"
              type="date"
              placeholder="选择考试日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label=""
            :prop="'examArrangeList.' + index + '.startTime'"
            :rules="{required: true, message: '考试开始时间不能为空', trigger: 'blur'}"
            :key="index + 'startTime'"
          >
            <el-time-select
              placeholder="开始时间"
              v-model="domain.startTime"
              :picker-options="{
                start: '10:00',
                step: '00:30',
                end: '18:30'
              }">
            </el-time-select>
          </el-form-item>
          <el-form-item
            label=""
            :prop="'examArrangeList.' + index + '.endTime'"
            :rules="{required: true, message: '考试结束时间不能为空', trigger: 'blur'}"
            :key="index + 'endTime'"
          >
            <el-time-select
              placeholder="结束时间"
              v-model="domain.endTime"
              :picker-options="{
                start: '10:00',
                step: '00:30',
                end: '18:30',
                minTime: domain.startTime
              }">
            </el-time-select>
          </el-form-item>
          <span class="arrange-button" :key="index + 'button'">
            <i v-if="index === 0" class="el-icon-circle-plus" @click.prevent="addArrange()"></i>
            <i v-else class="el-icon-remove"  @click.prevent="removeArrange(domain)"></i>
          </span>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { saveExamInfo } from '@/api/exam.js'

export default {
  name: '',
    props: {
    examInfo: {
      title: null,
      visible: {
        type: Boolean,
        default: false
      }
    }
  },
  data() {
    return {
      examForm: {
        name: null,
        examArrangeList: [{
          examDate: null,
          startTime: null,
          endTime: null
        }],
      },
      examRules: {
        name: [{ required: true, message: '考试名称不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
  },
  watch: {

  },
  methods: {
    load() {
      
    },
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
      });
    },
    submitForm(formName) {
      this.$refs.examForm.validate((valid) => {
        if (valid) {
          console.log(this.examForm);return
          saveExamInfo(this.examForm).then(res => {
            
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleClose(reload) {
      this.$refs.examForm.resetFields()
      this.$emit('closeExamDialog', { payload: reload })
    }
  },
  created() {
    
  },
  mounted() {
    
  },
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