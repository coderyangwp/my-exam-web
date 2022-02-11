<template>
  <div class="app-container">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>表字段配置: {{ tableName }}</span>
        <el-button
          type="warning"
          icon="el-icon-folder-checked"
          size="mini"
        >保存并生成</el-button>
        <el-button
          type="success"
          icon="el-icon-check"
          size="mini"
          :loading="saveLoading"
          @click="saveColumn"
        >保存</el-button>
        <el-button
          type="primary"
          icon="el-icon-refresh"
          size="mini"
          :loading="syncLoading"
          @click="load"
        >同步</el-button>
      </div>
      <el-form size="small">
        <el-table
          v-loading="loading"
          :data="columnList"
          style="width: 100%"
          size="small"
        >
          <el-table-column
            prop="columnName"
            label="字段名称"
          />
          <el-table-column
            prop="columnType"
            label="字段类型"
          />
          <el-table-column label="字段描述">
            <template slot-scope="scope">
              <el-input
                v-model="columnList[scope.$index].remark"
                placeholder="字段描述"
                clearable
                size="mini"
              />
            </template>
          </el-table-column>
          <el-table-column label="必填">
            <template slot-scope="scope">
              <el-checkbox v-model="columnList[scope.$index].notNull" />
            </template>
          </el-table-column>
          <el-table-column label="列表">
            <template slot-scope="scope">
              <el-checkbox v-model="columnList[scope.$index].listShow" />
            </template>
          </el-table-column>
          <el-table-column label="表单">
            <template slot-scope="scope">
              <el-checkbox v-model="columnList[scope.$index].formShow" />
            </template>
          </el-table-column>
          <el-table-column label="表单类型">
            <template slot-scope="scope">
              <el-select
                v-model="columnList[scope.$index].formType"
                placeholder="请选择表单类型"
                size="mini"
                clearable
              >
                <el-option
                  v-for="item in formTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { columnList, saveColumn } from '@/api/systool'
import { myMessage } from '@/utils/message'

export default {
  name: 'ColumnConfig',
  data() {
    return {
      loading: false,
      syncLoading: false,
      saveLoading: false,
      columnList: [],
      formTypeOptions: [
        {
          value: 'Input',
          label: '文本框'
        },
        {
          value: 'Textarea',
          label: '文本域'
        },
        {
          value: 'Radio',
          label: '单选框'
        },
        {
          value: 'Select',
          label: '下拉框'
        },
        {
          value: 'Date',
          label: '日期框'
        }
      ]
    }
  },
  computed: {
    tableName() {
      return this.$route.params.tableName
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      this.loading = true
      this.syncLoading = true
      columnList(this.tableName).then((r) => {
        this.columnList = r.data
        this.loading = false
        this.syncLoading = false
      })
    },
    saveColumn() {
      this.saveLoading = true
      this.columnList.forEach((item) => {
        item.tableName = this.tableName
      })
      console.log(this.columnList)
      saveColumn(this.columnList).then((r) => {
        myMessage()
        this.saveLoading = false
        this.load()
      })
    }
  }
}
</script>

<style scoped>
.clearfix .el-button {
  float: right;
  margin: 0 3px;
}
</style>
