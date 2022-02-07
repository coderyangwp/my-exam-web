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
        <el-select
          v-model="queryParams.level"
          size="small"
          clearable
          placeholder="请选择专业层次"
        >
          <el-option
            v-for="item in level"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select
          v-model="queryParams.status"
          size="small"
          clearable
          placeholder="请选择专业状态"
        >
          <el-option
            v-for="item in status"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-button
          type="default"
          icon="el-icon-search"
          size="small"
          @click="handlerSearch"
        >搜索</el-button>
        <el-button
          type="default"
          size="small"
          @click="handlerReset"
        >重置</el-button>
      </el-col>
    </el-row>
    <el-row class="search-content">
      <el-col>
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="handlerAddMajor"
        >添加</el-button>
        <el-button
          size="mini"
          type="success"
          icon="el-icon-edit"
          :disabled="selections.length !== 1"
          @click="handlerEdit(selections[0])"
        >编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          icon="el-icon-delete"
          :disabled="selections.length === 0"
          @click="handlerDel(selections)"
        >删除</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table
          ref="MajorTable"
          v-loading="loading"
          :data="tableData"
          border
          style="width: 100%"
          @selection-change="select"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            prop="name"
            label="专业名称"
          />
          <el-table-column
            prop="code"
            label="专业代码"
          />
          <el-table-column
            prop="level"
            label="专业层次"
          >
            <template slot-scope="scope">
              {{ scope.row.level === 5 ? '本科' : '专科' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="level"
            label="专业状态"
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
          @current-change="handleCurrentChange"
        >
          <template slot="total">
            总数
          </template>
        </el-pagination>
      </el-col>
    </el-row>
    <major-dialog
      :id="dialog.id"
      :visible="dialog.visible"
      :title="dialog.title"
      @closeDialog="closeDialog"
      @finishSave="handlerSaveFinish"
    />
  </div>
</template>

<script>
import { majorList, delMajor } from '@/api/major'
import MajorDialog from '@/views/major/MajorDialog'
import { dict } from '@/utils/dict'
import { myMessage, myConfirm } from '@/utils/message'

export default {
  name: 'Major',
  components: {
    MajorDialog
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
      level: [],
      status: [],
      dialog: {
        visible: false,
        title: '',
        id: null
      },
      selections: []
    }
  },
  created() {
    this.load()
    dict('major-level').then((res) => {
      this.level = res
    })
    dict('enable').then((res) => {
      this.status = res
    })
  },
  methods: {
    load() {
      majorList(this.queryParams).then((res) => {
        this.loading = false
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    handleCurrentChange(current) {
      this.queryParams.current = current
      this.load()
    },
    handlerSearch() {
      this.load()
    },
    handlerReset() {
      this.queryParams = this.$options.data().queryParams
      this.load()
    },
    select(selection) {
      this.selections = selection
    },
    handlerAddMajor() {
      this.dialog.visible = true
      this.dialog.title = '新增专业'
    },
    handlerEdit(data) {
      this.dialog.id = data.id
      this.dialog.visible = true
      this.dialog.title = '修改专业'
    },
    handlerDel(data) {
      const ids = []
      if (Object.prototype.toString.call(data) === '[object Array]') {
        data.forEach((item) => ids.push(item.id))
      } else {
        ids.push(data.id)
      }
      myConfirm('确认删除选中专业？').then(() => {
        delMajor(ids).then(() => {
          myMessage()
          this.load()
        })
      })
    },
    closeDialog() {
      this.dialog.visible = false
      this.dialog.id = 0
    },
    handlerSaveFinish() {
      this.closeDialog()
      this.load()
    }
  }
}
</script>

<style scoped>
.search-content .el-col {
  margin-right: 10px;
}
</style>
