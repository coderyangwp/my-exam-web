<template>
  <div class="app-container">
    <el-row class="generator-table-list">
      <el-col>
        <el-input
          v-model="queryParams.tableName"
          placeholder="请输入表名"
          size="small"
          clearable
        />
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
    <el-row>
      <el-col :span="24">
        <el-table
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column type="selection" />
          <el-table-column
            prop="tableName"
            label="表名称"
          />
          <el-table-column
            prop="engine"
            label="数据库引擎"
          />
          <el-table-column
            prop="tableCollation"
            label="字符编码集"
          />
          <el-table-column
            prop="tableComment"
            label="表备注"
          />
          <el-table-column
            prop="createTime"
            label="创建日期"
          />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text">
                <router-link :to="'/sys-tool/generator/config/' + scope.row.tableName">配置</router-link>
              </el-button>
              <el-button type="text">
                <router-link :to="'/sys-tool/generator/preview/' + scope.row.tableName">预览</router-link>
              </el-button>
              <el-button
                type="text"
                @click="downloadCode(scope.row.tableName)"
              >下载</el-button>
              <el-button type="text">生成</el-button>
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { tableList, packageFile, downloadFile } from '@/api/systool'
import { myMessage } from '@/utils/message'

export default {
  name: 'Generator',
  data() {
    return {
      tableData: [],
      total: 0,
      queryParams: {
        tableName: null,
        size: 10,
        current: 1
      }
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      tableList(this.queryParams).then((r) => {
        this.tableData = r.data.records
        this.total = r.data.total
      })
    },
    handlerReset() {
      Object.assign(this.queryParams, this.$options.data().queryParams)
      this.load()
    },
    handleCurrentChange(current) {
      this.queryParams.current = current
      this.load()
    },
    preview(tableName) {
      console.log(tableName)
    },
    downloadCode(tableName) {
      packageFile(tableName).then((r) => {
        downloadFile(r, tableName, 'zip')
        myMessage()
      })
    }
  }
}
</script>

<style scoped>
.generator-table-list {
  margin-bottom: 20px;
}

.generator-table-list .el-input {
  width: 300px;
  margin-right: 10px;
}
</style>
