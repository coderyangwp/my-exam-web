<template>
  <div class="app-container">
    <el-row class="search-content">
      <el-col :span="3">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          size="small"
          @clear="handlerSearch"
        />
      </el-col>
      <el-col :span="3">
        <el-input
          v-model="queryParams.level"
          placeholder="请输入角色级别"
          clearable
          size="small"
          @clear="handlerSearch"
        />
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
          @click="handlerAdd"
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
          ref="roleTable"
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
            label="名称"
          />
          <el-table-column
            prop="level"
            label="角色级别"
          />
          <el-table-column
            prop="description"
            label="描述"
          />
          <el-table-column
            prop="dataScope"
            label="数据权限"
          />
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
    <role-dialog
      :id="dialog.id"
      :visible="dialog.visible"
      :title="dialog.title"
      @closeDialog="closeDialog"
    />
  </div>
</template>

<script>
import { list, del } from '@/api/role'
import RoleDialog from '@/views/role/RoleDialog'
import { myConfirm, myMessage } from '@/utils/message'

export default {
  name: 'Role',
  components: {
    RoleDialog
  },
  data() {
    return {
      tableData: null,
      total: 0,
      loading: true,
      queryParams: {
        current: 1,
        size: 10,
        name: null,
        level: null
      },
      dialog: {
        visible: false,
        title: '',
        roleId: 0
      },
      selections: []
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      list(this.queryParams).then((res) => {
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
    handlerAdd() {
      this.dialog.visible = true
      this.dialog.title = '新增'
    },
    handlerEdit(data) {
      this.dialog.roleId = data.roleId
      this.dialog.visible = true
      this.dialog.title = '修改'
    },
    handlerDel(data) {
      const ids = []
      if (Object.prototype.toString.call(data) === '[object Array]') {
        data.forEach((item) => ids.push(item.roleId))
      } else {
        ids.push(data.roleId)
      }
      myConfirm('确认删除?').then(() => {
        del(ids).then(() => {
          myMessage()
          this.load()
        })
      })
    },
    closeDialog(payload) {
      Object.assign(this.dialog, this.$option.data().dialog)
      if (payload.reload) {
        this.load()
      }
    }
  }
}
</script>

<style scoped>
.search-content .el-col {
  margin-right: 10px;
}
</style>
