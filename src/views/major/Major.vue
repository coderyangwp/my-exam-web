<template>
  <div class="app-container">
    <el-row class="search-content">
      <el-col :span="3">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入专业代码"
          clearable
          size="small"
          @clear="handlerSearch"
        />
      </el-col>
      <el-col :span="3">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入专业名称"
          clearable
          size="small"
          @clear="handlerSearch"
        />
      </el-col>
      <el-col :span="3">
        <el-select v-model="queryParams.level" size="small" placeholder="请选择专业层次">
          <el-option
            v-for="item in level"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select v-model="queryParams.status" size="small" placeholder="请选择专业状态">
          <el-option
            v-for="item in status"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="2">
        <el-button type="default" icon="el-icon-search" size="small" @click="handlerSearch">搜索</el-button>
      </el-col>
    </el-row>
    <el-row class="search-content">
      <el-col>
        <el-button-group>
          <el-button size="small" icon="el-icon-plus" @click="handlerAddMajor">添加专业</el-button>
          <el-button size="small" icon="el-icon-delete">删除专业</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table
          v-loading="loading"
          :data="tableData"
          border
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          @selection-change="handlerSelection">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="name"
            label="专业名称">
          </el-table-column>
          <el-table-column
            prop="code"
            label="专业代码">
          </el-table-column>
          <el-table-column
            prop="level"
            label="专业层次">
            <template slot-scope="scope">
              <!--{{scope.row.level === 5 ? '本科' : '专科'}}-->
              <my-dict mode="list" :value="scope.row.level" dictKey="major-level" />
            </template>
          </el-table-column>
          <el-table-column
            prop="level"
            label="专业状态">
            <template slot-scope="scope">
              <my-dict mode="list" :value="scope.row.status" dictKey="enable" />
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small" @click="handlerEdit(scope.row.id)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
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
    <major-dialog
      :visible="dialog.visible"
      :title="dialog.title"
      :id = dialog.id
      @closeDialog="closeDialog"
      @finishSave="handlerSaveFinish"
      />
  </div>
</template>

<script>
import { majorList } from '@/api/major'
import MajorDialog from '@/views/major/MajorDialog'
import MyDict from '@/components/Dict/MyDict'

export default {
  name: 'Major',
  components: {
    MajorDialog,
    MyDict
  },
  data() {
    return {
      tableData: null,
      total: 0,
      loading: true,
      queryParams: {
        current: 1,
        size: 10,
        code: null,
        name: null,
        level: null,
        status: null
      },
      level: [
        { name: '本科', value: 5 },
        { name: '专科', value: 6 }
      ],
      status: [
        { name: '启用', value: 0 },
        { name: '未启用', value: 1 }
      ],
      dialog: {
        visible: false,
        title: '',
        id: null
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      majorList(this.queryParams).then(response => {
        this.loading = false
        this.tableData = response.data.records
        this.total = response.data.total
      })
    },
    handleCurrentChange(current) {
      this.queryParams.current = current
      this.getList()
    },
    handlerSelection(selection) {
      console.log(selection)
    },
    handlerSearch() {
      this.getList()
    },
    handlerAddMajor() {
      this.dialog.visible = true
      this.dialog.title = '新增专业'
    },
    handlerEdit(id) {
      this.dialog.id = id
      this.dialog.visible = true
      this.dialog.title = '修改专业'
    },
    closeDialog() {
      this.dialog.visible = false
      this.dialog.id = 0
    },
    handlerSaveFinish() {
      this.closeDialog()
      this.getList()
    }
  }
}
</script>

<style scoped>
  .search-content {
    margin-bottom: 20px;
  }
  .search-content .el-col{
    margin-right: 10px;
  }
</style>
