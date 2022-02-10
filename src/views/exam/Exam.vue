<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="14">
        <el-card>
          <el-row
            type="flex"
            justify="space-between"
            class="exam-toolbar"
          >
            <el-col :span="8">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-plus"
                @click="handlerAdd"
              >添加</el-button>
              <el-button
                type="success"
                size="small"
                icon="el-icon-edit"
                :disabled="selections.length !== 1"
                @click="handlerEdit(selections[0])"
              >修改</el-button>
              <el-button
                type="danger"
                size="small"
                icon="el-icon-delete"
                :disabled="selections.length === 0"
                @click="handlerDel(selections)"
              >删除</el-button>
            </el-col>
            <el-col
              :span="16"
              class="exam-toolbar-right"
            >
              <el-input
                v-model="queryParams.name"
                placeholder="请输入考试名称"
                size="small"
                clearable
              />
              <el-select
                v-model="queryParams.status"
                size="small"
                placeholder="请选择考试状态"
              >
                <el-option
                  v-for="item in dictStatus"
                  :key="item.id"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
              <el-button
                icon="el-icon-search"
                size="small"
                @click="load"
              >搜索</el-button>
              <el-button
                icon="el-icon-refresh"
                size="small"
                @click="handlerReset"
              >重置</el-button>
            </el-col>
          </el-row>
          <el-table
            :data="tableData"
            border
            style="width: 100%"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
            highlight-current-row
            @selection-change="selectRow"
            @current-change="currentRow"
          >
            <el-table-column type="selection" />
            <el-table-column
              prop="year"
              label="年份"
              width="180"
            />
            <el-table-column
              prop="month"
              label="月份"
              width="180"
            />
            <el-table-column
              prop="name"
              label="名称"
              width="360"
            />
            <el-table-column label="状态">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.status === 0 ? 'danger' : 'success'"
                  disable-transitions
                >{{ scope.row.status === 0 ? '未启用' : '启用' }}</el-tag>
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
            @current-change="handleCurrentChange"
          >
            <template slot="total"> 总数 </template>
          </el-pagination>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card>
          <div
            slot="header"
            class="clearfix"
          >
            <span>考试安排</span>
          </div>
          <el-table
            v-if="Object.keys(currentExam).length > 0"
            :data="currentExam.examArrangeList"
            style="width: 100%"
          >
            <el-table-column
              type="index"
              label="考试安排"
              width="150"
              size="mini"
            >
              <template slot-scope="scope">第{{ scope.$index + 1 }}场考试</template>
            </el-table-column>
            <el-table-column label="考试日期">
              <template slot-scope="scope">
                {{ scope.row.examDate | dateFormat }}
              </template>
            </el-table-column>
            <el-table-column
              prop="startTime"
              label="开始时间"
            />
            <el-table-column
              prop="endTime"
              label="结束"
            />
            <el-table-column
              label="操作"
              width="160"
            >
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="handlerCourse(scope.row.id)"
                >
                  维护考试科目
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div
            v-else
            class="my-code"
          >点击考试查看考试安排</div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-card>
          <div
            slot="header"
            class="clearfix"
          >
            <span>考试科目安排</span>
          </div>
          <el-collapse
            v-if="Object.keys(currentExam).length > 0"
            v-loading="courseLoading"
            accordion
          >
            <el-collapse-item
              v-for="(arrange,index) in examList"
              :key="arrange.id"
              :title="'第' + (index + 1) +'场考试'"
              :name="index"
            >
              <div class="exam-course-tag">
                <el-tag
                  v-for="course in arrange.examCourses"
                  :key="course.code"
                  effect="plain"
                >{{ course.name }} {{ course.code }}</el-tag>
              </div>
            </el-collapse-item>
          </el-collapse>
          <div
            v-else
            class="my-code"
          >点击考试查看考试科目</div>
        </el-card>
      </el-col>
    </el-row>
    <exam-dialog
      :exam-info="examDialog"
      @closeExamDialog="handlerCloseDialog"
    />
    <exam-course
      :course-info="examCourseDialog"
      @closeExamCourse="handlerCloseCourse"
    />
  </div>
</template>

<script>
import { examList, delExam, loadExamCourse } from '@/api/exam'
import { dict } from '@/utils/dict'
import { myMessage, myConfirm } from '@/utils/message'
import { formatDates } from '@/utils/date.js'
import ExamDialog from '@/views/exam/ExamDialog'
import ExamCourse from '@/views/exam/ExamCourse'

export default {
  name: 'Exam',
  components: {
    ExamDialog,
    ExamCourse
  },
  filters: {
    dateFormat(d) {
      return formatDates(new Date(d), 'yyyy-MM-dd')
    }
  },
  data() {
    return {
      courseLoading: false,
      tableData: [], // 考试数据
      total: 0, // 考试数
      queryParams: {
        // 查询参数
        name: null,
        status: null,
        size: 10,
        current: 1
      },
      dictStatus: [], // 字典
      selections: [], // checkbox勾选的数据
      currentExam: {}, // 选中的考试
      examList: [], // 当前选中考试的考试课程
      examDialog: {
        // 向ExamDialog组件传递的参数
        title: '维护考试信息',
        visible: false,
        id: 0,
        name: null,
        year: null,
        month: null,
        status: null,
        examArrangeList: []
      },
      examCourseDialog: {
        // 向ExamCourse组件传递的参数
        title: '考试课程维护',
        visible: false,
        examId: 0,
        examArrangeId: 0
      }
    }
  },
  created() {
    dict('enable').then((r) => {
      this.dictStatus = r
    })
    this.load()
  },
  methods: {
    load() {
      examList(this.queryParams).then((r) => {
        this.tableData = r.data.records
        this.total = r.data.total
        this.selections = []
        this.currentExam = {}
      })
    },
    // 重置查询
    handlerReset() {
      this.selections = []
      this.currentExam = {}
      Object.assign(this.queryParams, this.$options.data().queryParams)
      this.load()
    },
    // 根据考试获取考试课程
    loadExamCourse() {
      this.courseLoading = true
      if (Object.keys(this.currentExam).length > 0) {
        loadExamCourse(this.currentExam.id).then((r) => {
          this.examList = r.data
          this.courseLoading = false
        })
      }
    },
    // 翻页
    handleCurrentChange(current) {
      this.queryParams.current = current
      this.load()
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
      this.selections.filter((item) => {
        ids.push(item.id)
      })
      myConfirm('确认删除勾选的考试？').then(() => {
        delExam(ids).then((r) => {
          myMessage()
          this.handlerReset()
        })
      })
    },
    // 勾选考试checkbox
    selectRow(selection) {
      this.selections = selection
    },
    // 点击考试信息
    currentRow(currentRow) {
      this.currentExam = currentRow
      this.loadExamCourse()
    },
    handlerCloseDialog(payload) {
      Object.assign(this.examDialog, this.$options.data().examDialog)
      console.log(payload)
      if (payload.reload) {
        this.handlerReset()
      }
    },
    handlerCourse(id) {
      this.examCourseDialog.visible = true
      this.examCourseDialog.examId = this.currentExam.id
      this.examCourseDialog.examArrangeId = id
    },
    handlerCloseCourse(payload) {
      this.examCourseDialog.visible = false
      if (payload.reload) {
        this.loadExamCourse()
      }
    }
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.exam-toolbar {
  padding-bottom: 10px;
}
.exam-toolbar-right {
  text-align: right;
}
.exam-toolbar-right .el-input {
  width: 40%;
}
.exam-toolbar-right .el-input,
.exam-toolbar-right .el-select {
  padding-right: 10px;
}
.my-code {
  position: relative;
  padding: 15px;
  line-height: 20px;
  border-left: 5px solid #ddd;
  color: #333;
  font-family: Courier New, serif;
  font-size: 14px;
}
.exam-course-tag .el-tag {
  margin: 5px;
}
</style>
