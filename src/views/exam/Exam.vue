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
            accordion
          >
            <el-collapse-item
              title="一致性 Consistency"
              name="1"
            >
              <div>
                与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；
              </div>
              <div>
                在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。
              </div>
            </el-collapse-item>
            <el-collapse-item
              title="反馈 Feedback"
              name="2"
            >
              <div>
                控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；
              </div>
              <div>
                页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。
              </div>
            </el-collapse-item>
            <el-collapse-item
              title="效率 Efficiency"
              name="3"
            >
              <div>简化流程:设计简洁直观的操作流程</div>
              <div>
                清晰明确:语言表达清晰且表意明确,让用户快速理解进而作出决策
              </div>
              <div>
                帮助用户识别:界面简单直白,让用户快速识别而非回忆,减少用户记忆负担。
              </div>
            </el-collapse-item>
            <el-collapse-item
              title="可控 Controllability"
              name="4"
            >
              <div>
                用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；
              </div>
              <div>
                结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。
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
import { examList, delExam } from '@/api/exam.js'
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
      tableData: [],
      total: 0,
      queryParams: {
        // 查询参数
        name: null,
        status: null,
        size: 10,
        current: 1
      },
      dictStatus: [],
      selections: [], // checkbox勾选的数据
      currentExam: {}, // 单击行时的数据
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
        id: 0
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
    selectRow(selection) {
      this.selections = selection
    },
    currentRow(currentRow) {
      this.currentExam = currentRow
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
      this.examCourseDialog.id = id
    },
    handlerCloseCourse() {
      this.examCourseDialog.visible = false
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
</style>
