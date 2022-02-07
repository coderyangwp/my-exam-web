<template>
  <div class="app-container">
    <el-dialog
      :title="courseInfo.title"
      :visible="courseInfo.visible"
      width="1000px"
      @close="handleClose(false)"
    >
      <el-row
        :gutter="20"
        class="exam-course-content"
      >
        <el-col :span="12">
          <el-input
            v-model="queryParams.name"
            size="mini"
            placeholder="请输入课程名称或编码"
            prefix-icon="el-icon-edit"
            clearable
            class="input-w-150 m-r-5"
            @keyup.enter.native="handlerSearch"
          />
          <el-button
            size="mini"
            type="default"
            icon="el-icon-search"
            @click="handlerSearch"
          >
            查询
          </el-button>
          <el-button
            size="mini"
            icon="el-icon-plus"
            type="primary"
            :disabled="selections.length === 0"
            @click="handlerAdd"
          >添加科目</el-button>
          <el-table
            :data="courseList"
            style="width: 100%"
            class="exam-course-table"
            :stripe="true"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }"
            @selection-change="selected"
          >
            <el-table-column type="selection" />
            <el-table-column
              label="课程名称"
              prop="name"
            />
            <el-table-column
              label="课程代码"
              prop="code"
            />
          </el-table>
          <el-pagination
            class="fr pagination-container"
            background
            layout="prev, pager, next, total"
            :total="total"
            :page-size="queryParams.size"
            :current-page="queryParams.current"
            :hide-on-single-page="true"
            @current-change="handleCurrentChange"
          >
            <template slot="total"> 总数 </template>
          </el-pagination>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover">
            <div
              slot="header"
              class="clearfix"
            >
              <span>已添加科目({{ addCourseList.length }})</span>
              <el-input
                v-model="searchCode"
                size="mini"
                placeholder="请输入课程编码"
                prefix-icon="el-icon-edit"
                clearable
                class="my-add-course-search"
                @keydown.native="handlerSearchMyCourse"
              />
            </div>
            <template v-for="course in addCourseList">
              <el-tag
                v-if="course.show"
                :key="course.id"
                closable
                @close="handlerCloseTag(course)"
              >
                {{ course.name }} {{ course.code }}
              </el-tag>
            </template>
          </el-card>
        </el-col>
      </el-row>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="submitForm"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { courseList } from '@/api/major.js'

export default {
  name: 'ExamCourse',
  props: {
    courseInfo: {
      type: Object,
      default: () => ({}),
      title: {
        type: String,
        default: ''
      },
      visible: {
        type: Boolean,
        default: false
      },
      examArrangeId: {
        type: Number,
        default: 0
      }
    }
  },
  data() {
    return {
      courseList: [], // 搜索的科目
      selections: [], // 勾选的科目
      addCourseList: [], // 添加的科目
      queryParams: {
        // 搜索参数
        name: null,
        code: null,
        current: 1,
        size: 10
      },
      total: 0, // 搜索到的科目数
      searchCode: null // 从已添加科目中搜索
    }
  },
  watch: {
    searchCode() {
      this.resetMyCourseStatus()
      this.handlerSearchMyCourse()
    }
  },
  // 方法集合
  methods: {
    handlerSearch() {
      if (this.queryParams.name && this.queryParams.name.trim() !== '') {
        if (/^\d+$/.test(this.queryParams.name)) {
          // 如果输入的是数字，则查询课程代码，否则查询课程名称
          this.queryParams.code = this.queryParams.name
          this.queryParams.name = null
        } else {
          this.queryParams.code = null
        }
        courseList(this.queryParams).then((r) => {
          this.courseList = r.data.records
          this.total = r.data.total
        })
      }
    },
    handleCurrentChange(current) {
      this.queryParams.current = current
      this.handlerSearch()
    },
    selected(selection) {
      this.selections = selection
    },
    handlerAdd() {
      this.selections.forEach((item) => {
        const index = this.addCourseList.findIndex(
          (course) => course.id === item.id
        )
        if (index === -1) {
          this.addCourseList.push({
            id: item.id,
            name: item.name,
            code: item.code,
            show: true
          })
        } else {
          console.log('科目重复添加')
        }
      })
    },
    handlerCloseTag(tag) {
      const index = this.addCourseList.findIndex((item) => item === tag)
      this.addCourseList.splice(index, 1)
    },
    resetMyCourseStatus() {
      this.addCourseList.filter((item) => {
        item.show = true
      })
    },
    handlerSearchMyCourse() {
      if (
        this.searchCode &&
        this.searchCode.trim() !== '' &&
        this.addCourseList.length > 0
      ) {
        this.addCourseList.filter((item) => {
          if (/^\d+$/.test(this.searchCode)) {
            // 如果输入的是数字，用科目代码筛选 否则用科目名称筛选
            if (item.code.indexOf(this.searchCode) === -1) {
              item.show = false
            }
          } else {
            if (item.name.indexOf(this.searchCode) === -1) {
              item.show = false
            }
          }
        })
      }
    },
    submitForm() {},
    handleClose(reload) {
      // 不使用resetFields方法，因为对于数组元素无法清空
      Object.assign(this.$data, this.$options.data())
      this.$emit('closeExamCourse', { reload: reload })
    }
  }
}
</script>

<style scoped>
.exam-course-content {
  height: 490px;
}
.exam-course-content .el-col-12 {
  height: 100%;
  overflow: auto;
}
/deep/.exam-course-table .el-table__cell {
  padding: 6px 0;
  font-size: 12px;
}
.exam-course-content .el-tag {
  margin: 5px;
}
.my-add-course-search {
  width: 150px;
  float: right;
}
</style>
