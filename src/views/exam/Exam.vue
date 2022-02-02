<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-descriptions :column=1 :border="true">
          <el-descriptions-item label="考试名称">2022年上半年新疆维吾尔自治区高等教育自学考试</el-descriptions-item>
          <el-descriptions-item label="年份">2022</el-descriptions-item>
          <el-descriptions-item label="月份">4</el-descriptions-item>
          <el-descriptions-item label="第一场">4月16日 10:00 - 4月16日 12:30</el-descriptions-item>
          <el-descriptions-item label="第二场">4月16日 14:00 - 4月16日 16:30</el-descriptions-item>
          <el-descriptions-item label="第三场">4月17日 10:00 - 4月17日 12:30</el-descriptions-item>
          <el-descriptions-item label="第四场">4月17日 14:00 - 4月17日 16:30</el-descriptions-item>
        </el-descriptions>
      </el-col>
      <el-col :span="16">
        <el-row type="flex" justify="space-between" class="exam-toolbar">
          <el-col :span="8">
            <el-button type="primary" size="small" icon="el-icon-plus" @click="handlerAdd">添加</el-button>
            <el-button type="success" size="small" icon="el-icon-edit" :disabled="selections.length !== 1" @click="handlerEdit(selections[0])">修改</el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" :disabled="selections.length === 0" @click="handlerDel(selections)">删除</el-button>
          </el-col>
          <el-col :span="16" class="exam-toolbar-right">
            <el-input v-model="queryParams.code" placeholder="请输入考试名称" size="small" clearable />
            <el-select v-model="queryParams.status" size="small" placeholder="请选择考试状态">
              <el-option
                v-for="item in dictStatus"
                :label="item.name"
                :value="item.code"
                :key="item.id"
              >
              </el-option>
            </el-select>
            <el-button icon="el-icon-search" size="small" @click="load">搜索</el-button>
            <el-button icon="el-icon-refresh" size="small" @click="handlerReset">重置</el-button>
          </el-col>
        </el-row>
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          highlight-current-row
          @selection-change="selectRow"
          @current-change="currentRow"
          >
          <el-table-column type="selection" />
          <el-table-column
            prop="year"
            label="年份"
            width="180">
          </el-table-column>
          <el-table-column
            prop="month"
            label="月份"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称">
          </el-table-column>
          <el-table-column
            label="状态">
            <template slot-scope="scope">
              <el-tag
              :type="scope.row.status === 0 ? 'danger' : 'success'"
              disable-transitions>{{scope.row.status === 0 ? '未启用' : '启用'}}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>

    </el-row>

    <exam-dialog :examInfo="examDialog" @closeExamDialog="handlerCloseDialog"></exam-dialog>
  </div>
</template>

<script>
import { examList } from '@/api/exam.js' 
import { dict } from '@/utils/dict'
import ExamDialog from '@/views/exam/ExamDialog'

export default {
  name: 'Exam',
  components: {
    ExamDialog
  },
  data() {
    return {
      tableData: [],
      queryParams: {
        name: null,
        status: null,
        size: 10,
        current: 1
      },
      dictStatus: [],
      selections: [],
      examDialog: {
        title: '维护考试信息',
        visible: false
      },
      currentExam: {}
    }
  },
  created() {
    dict('enable').then(res => {
      this.dictStatus = res
    })
    this.load()
  },
  methods: {
    load() {
      examList(this.queryParams).then(r => {
        this.tableData = r.data.records
      })
    },
    handlerReset() {
      Object.assign(this.queryParams, this.$options.data().queryParams)
      this.selectRow = {}
      this.selections = []
      this.load()
    },
    handlerAdd() {
      this.examDialog.visible = true
    },
    handlerEdit() {

    },
    handlerDel() {

    },
    selectRow(selection) {
      this.selections = selection
    },
    selectRow(currentRow) {
      this.currentExam = currentRow
    },
    handlerCloseDialog(payload) {
      Object.assign(this.examDialog, this.$options.data().examDialog)
    }
  }
}
</script>

<style scoped>
 .exam-toolbar {
   padding-bottom: 10px;
 }
 .exam-toolbar-right {
   text-align: right;
 }
 .exam-toolbar-right .el-input {
   width: 40%;
 }
 .exam-toolbar-right .el-input, .exam-toolbar-right .el-select {
   padding-right: 10px;
 }
</style>
