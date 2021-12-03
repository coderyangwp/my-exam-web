<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-row class="dict-button">
          <el-button size="small" type="primary" icon="el-icon-plus">添加</el-button>
          <el-button size="small" type="danger" icon="el-icon-delete">删除</el-button>
        </el-row>
        <el-row>
          <el-table
            :data="dict"
            style="width: 100%"
            :border="true"
            highlight-current-row
            @current-change="handlerSelectRow"
          >
            <el-table-column
              prop="name"
              label="字典名称"
              sortable
            >
            </el-table-column>
            <el-table-column
              prop="code"
              label="字典编码"
              >
            </el-table-column>
            <el-table-column
              prop="descript"
              label="字典描述"
              >
            </el-table-column>
            <el-table-column
              prop="status"
              label="字典状态"
              >
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.tag === 0 ? '正常' : '冻结'"
                  disable-transitions>{{scope.row.status}}</el-tag>
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
      </el-col>
      <el-col :span="12" v-if="dictChild.length > 0">
        <el-row class="dict-button">
          <el-button size="small" type="primary" icon="el-icon-plus">添加</el-button>
          <el-button size="small" type="danger" icon="el-icon-delete">删除</el-button>
        </el-row>
        <el-row>
          <el-table
            :data="dictChild"
            style="width: 100%"
            :border="true"
            highlight-current-row
          >
            <el-table-column
              prop="name"
              label="值"
              sortable
            >
            </el-table-column>
            <el-table-column
              prop="code"
              label="代码"
            >
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
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { dictList, dictDetail, addDict, addDictChild } from '@/api/system'

export default {
  name: 'Dict',
  data() {
    return {
      dict: [],
      dictChild: [],
      total: 0,
      queryParams: {
        current: 1,
        size: 10
      }
    }
  },
  created() {
    this.dictList()
  },
  methods: {
    dictList() {
      dictList(this.queryParams).then(response => {
        this.dict = response.data.records
        this.total = response.data.total
      })
    },
    handleCurrentChange(current) {
      this.queryParams.current = current
    },
    // 点击字典，查看该字典的子数据
    handlerSelectRow(currentRow) {
      dictDetail(currentRow.code).then(res => {
        console.log(res)
        this.dictChild = res.data
      })
    }
  }
}
</script>

<style scoped>
  .dict-button, .dict-code-button {
    padding-bottom: 20px;
  }
</style>
