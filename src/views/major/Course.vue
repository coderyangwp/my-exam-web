<template>
  <div class="app-container">
    <el-row
      :gutter="20"
      class="search-content"
    >
      <el-col :span="3">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入课程代码"
          size="small"
          clearable
        />
      </el-col>
      <el-col :span="3">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入课程名称"
          size="small"
          clearable
        />
      </el-col>
      <el-col :span="3">
        <el-select
          v-model="queryParams.status"
          size="small"
          placeholder="请选择课程状态"
        >
          <el-option
            v-for="item in dictStatus"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-button
          icon="el-icon-search"
          size="small"
          @click="load"
        >搜索</el-button>
        <el-button
          size="small"
          @click="handlerReset"
        >重置</el-button>
      </el-col>
    </el-row>
    <el-row class="search-content">
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
    </el-row>
    <el-row>
      <el-table
        v-loading="loading"
        :data="courseData"
        border
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
        @selection-change="select"
      >
        <el-table-column type="selection" />
        <el-table-column
          prop="code"
          label="课程代码"
        />
        <el-table-column
          prop="name"
          label="课程名称"
        />
        <el-table-column
          prop="score"
          label="课程学分"
        />
        <el-table-column
          prop="status"
          label="课程状态"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status === 0 ? 'danger' : 'success'"
              disable-transitions
            >{{ scope.row.status === 0 ? '未启用' : '启用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="handlerEdit(scope.row)"
            />
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="handlerDel(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-pagination
          class="fr pagination-container"
          background
          layout="prev, pager, next, total"
          :total="total"
          :page-size="queryParams.size"
          :current-page="queryParams.current"
          @current-change="handleCurrentChange"
        >
          <template slot="total">
            总数
          </template>
        </el-pagination>
      </el-col>
    </el-row>
    <course-dialog
      :dialog="dialog"
      @closeDialog="closeDialog"
    />
  </div>
</template>

<script>
import { dict } from '@/utils/dict'
import { courseList, delCourse } from '@/api/major'
import { myConfirm, myMessage } from '@/utils/message'
import CourseDialog from '@/views/major/CourseDialog'

export default {
  name: 'Course',
  components: {
    CourseDialog
  },
  data() {
    return {
      courseData: null,
      dictStatus: [],
      queryParams: {
        name: null,
        code: null,
        status: null,
        size: 10,
        current: 1
      },
      total: 0,
      loading: true,
      dialog: {
        visible: false,
        title: '',
        id: 0
      },
      selections: []
    }
  },
  created() {
    dict('enable').then((res) => {
      this.dictStatus = res
    })
    this.load()
  },
  methods: {
    load() {
      courseList(this.queryParams).then((res) => {
        this.courseData = res.data.records
        this.queryParams.size = res.data.size
        this.queryParams.current = res.data.current
        this.total = res.data.total
        this.loading = false
      })
    },
    handleCurrentChange(current) {
      this.queryParams.current = current
      this.load()
    },
    handlerReset() {
      this.queryParams = this.$options.data().queryParams
      this.load()
    },
    select(selection) {
      this.selections = selection
    },
    handlerAdd() {
      this.dialog.visible = true
      this.dialog.title = '新增课程'
    },
    handlerEdit(data) {
      this.dialog.title = '修改课程'
      Object.assign(this.dialog, data)
      this.dialog.visible = true
      this.dialog.title = '修改课程'
    },
    handlerDel(data) {
      const ids = []
      if (Object.prototype.toString.call(data) === '[object Array]') {
        data.forEach((item) => ids.push(item.id))
      } else {
        ids.push(data.id)
      }
      myConfirm('确认删除选中专业？').then(() => {
        delCourse(ids).then(() => {
          myMessage()
          this.load()
        })
      })
    },
    closeDialog(payload) {
      Object.assign(this.dialog, this.$options.data().dialog)
      if (payload.reload) {
        this.load()
      }
    }
  }
}
</script>

<style scoped>
</style>
