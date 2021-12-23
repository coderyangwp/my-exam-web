<template>
  <div class="app-container">
    <el-row :gutter="20" class="search-content">
      <el-col :span="3">
        <el-input v-model="queryParams.code" placeholder="请输入课程代码" size="small" clearable />
      </el-col>
      <el-col :span="3">
        <el-input v-model="queryParams.name" placeholder="请输入课程名称" size="small" clearable />
      </el-col>
      <el-col :span="3">
        <el-select v-model="queryParams.status" size="small" placeholder="请选择课程状态">
          <el-option
            v-for="item in dictStatus"
            :label="item.name"
            :value="item.code"
            :key="item.id"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-button icon="el-icon-search" size="small" @click="load">搜索</el-button>
        <el-button size="small" @click="handlerReset">重置</el-button>
      </el-col>
    </el-row>
    <el-row class="search-content">
      <el-button-group>
        <el-button size="small" icon="el-icon-plus">添加课程</el-button>
        <el-button size="small" icon="el-icon-delete">删除课程</el-button>
      </el-button-group>
    </el-row>
    <el-row>
      <el-table
        :data="courseData"
        border
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
        v-loading="loading"
      >
        <el-table-column type="selection" />
        <el-table-column prop="code" label="课程代码" />
        <el-table-column prop="name" label="课程名称" />
        <el-table-column prop="score" label="课程学分" />
        <el-table-column prop="status" label="课程状态">
          <template slot-scope="scope">
            <el-tag type="success">{{scope.row.status | dictFilter(dictStatus)}}</el-tag>
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
          @current-change="handleCurrentChange">
          <template slot="total">
            总数
          </template>
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { dict } from '@/utils/dict'
import { dictFilter } from '@/utils/filters'
import { courseList, saveCourse, delCourse } from '@/api/major'

export default {
  name: 'Course',
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
      loading: true
    }
  },
  created() {
    this.dictStatus = dict('enable').then(res => {
      this.dictStatus = res
    })
    this.load()
  },
  methods: {
    load() {
      courseList(this.queryParams).then(res => {
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
    }
  },
  filters: {
    dictFilter
  }
}
</script>

<style scoped>

</style>
