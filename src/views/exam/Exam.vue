<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="14">
        <el-row type="flex" justify="space-between" class="exam-toolbar">
          <el-col :span="8">
            <el-button type="primary" size="small" icon="el-icon-plus" @click="handlerAdd">添加</el-button>
            <el-button type="success" size="small" icon="el-icon-edit" :disabled="selections.length !== 1" @click="handlerEdit(selections[0])">修改</el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" :disabled="selections.length === 0" @click="handlerDel(selections)">删除</el-button>
          </el-col>
          <el-col :span="16" class="exam-toolbar-right">
            <el-input v-model="queryParams.name" placeholder="请输入考试名称" size="small" clearable />
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
        <el-pagination
          class="fr pagination-container"
          background
          layout="prev, pager, next, total"
          :total="total"
          :page-size="queryParams.size"
          :current-page="queryParams.current"
          @current-change="handleCurrentChange">
          <template slot="total">
            总数
          </template>
        </el-pagination>
      </el-col>
      <el-col v-show="Object.keys(currentExam).length > 0" :span="10">
        <table class="exam-arrange">
          <tr>
            <td>考试名称</td>
            <td colspan="3" v-text="currentExam.name"></td>
          </tr>
          <tr>
            <td>考试年份</td>
            <td v-text="currentExam.year + '年'"></td>
            <td>考试月份</td>
            <td v-text="currentExam.month + '月'"></td>
          </tr>
          <tr>
            <td colspan="4">考试安排</td>
          </tr>
          <template v-for="(arrange,index) in currentExam.examArrangeList">
            <tr>
              <td v-text="'第' + (index + 1) + '场'"></td>
              <td colspan="3">{{arrange.examDate | dateFormat}} {{arrange.startTime}} - {{arrange.endTime}}</td>
            </tr>
          </template>
        </table>
      </el-col>
    </el-row>
    <exam-dialog :examInfo="examDialog" @closeExamDialog="handlerCloseDialog"></exam-dialog>
  </div>
</template>

<script>
import ExamDialog from '@/views/exam/ExamDialog'
import { examList, delExam } from '@/api/exam.js' 
import { dict } from '@/utils/dict'
import { myMessage, myConfirm } from '@/utils/message'
import { formatDates } from '@/utils/date.js'

export default {
  name: 'Exam',
  components: {
    ExamDialog
  },
  data() {
    return {
      tableData: [],
      total: 0,
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
        visible: false,
        id: 0,
        name: null,
        year: null,
        month: null,
        status: null,
        examArrangeList: []
      },
      currentExam: {}
    }
  },
  created() {
    dict('enable').then(r => {
      this.dictStatus = r
    })
    this.load()
  },
  methods: {
    load() {
      examList(this.queryParams).then(r => {
        this.tableData = r.data.records
        this.total = r.data.total
      })
    },
    handlerReset() {
      this.selections = []
      this.currentExam = {}
      Object.assign(this.queryParams, this.$options.data().queryParams)
      this.load()
    },
    handleCurrentChange(current) {
      this.queryParams.current = current
    },
    handlerAdd() {
      this.examDialog.visible = true
    },
    handlerEdit(data) {
      Object.assign(this.examDialog, data)
      this.examDialog.visible = true
    },
    handlerDel() {
      const ids = []
      this.selections.filter(item => {
        ids.push(item.id)
      });
      myConfirm('确认删除勾选的考试？').then(() => {
        delExam(ids).then(r => {
          myMessage()
          this.handlerReset()
        })
      })
    },
    selectRow(selection) {
      this.selections = selection
    },
    currentRow(currentRow) {
      this.currentExam = currentRow
    },
    handlerCloseDialog(payload) {
      Object.assign(this.examDialog, this.$options.data().examDialog)
      console.log(payload);
      if(payload.reload) {
        this.handlerReset()
      }
    }
  },
  filters: {
    dateFormat(d) {
      return formatDates(new Date(d), 'MM-dd日')
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
 .exam-arrange {
   width: 100%;
   border-collapse: collapse;
 }
 .exam-arrange tr {
   line-height: 30px;
 }
 .exam-arrange td {
   padding: 5px;
   border: 1px solid #EBEEF5;
   width: 25%;
   text-align: center;
   font-size: 14px;
    color: #606266;
 }
 .exam-arrange td:nth-child(odd) {
   width: 20%;
 }
  .exam-arrange td:nth-child(even) {
   width: 30%;
 }
</style>
