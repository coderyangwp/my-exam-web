<template>
  <div class="app-container">
    <el-card class="generator-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span class="card-title">表字段配置: {{ tableName }}</span>
        <el-button
          type="warning"
          icon="el-icon-folder-checked"
          size="mini"
          @click="genCode"
        >生成</el-button>
        <el-button
          type="success"
          icon="el-icon-check"
          size="mini"
          :loading="saveLoading"
          @click="saveColumn"
        >保存
        </el-button>
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
          <el-table-column label="字典配置">
            <template slot-scope="scope">
              <el-select
                v-model="columnList[scope.$index].dictName"
                placeholder="请选择字典类型"
                size="mini"
                clearable
              >
                <el-option
                  v-for="item in dictOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </el-card>
    <el-card class="generator-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span class="card-title">生成配置</span>
        <el-button
          type="success"
          icon="el-icon-folder-checked"
          size="mini"
          :loading="configLoading"
          @click="saveConfig('configForm')"
        >保存</el-button>
      </div>
      <el-form
        ref="configForm"
        size="small"
        :model="configForm"
        :rules="configRules"
        class="table-config-form"
        label-width="140px"
      >
        <el-form-item
          label="作者"
          prop="author"
          required
        >
          <el-input
            v-model="configForm.author"
            clearable
          />
          <span>注释作者名称</span>
        </el-form-item>
        <el-form-item
          label="模块名称"
          prop="moduleName"
          required
        >
          <el-input
            v-model="configForm.moduleName"
            clearable
          />
          <span>模块名称，用于生成后端mapper文件和前端vue文件及api文件的文件夹命名</span>
        </el-form-item>
        <el-form-item
          label="置于哪个包下"
          prop="pack"
          required
        >
          <el-input
            v-model="configForm.pack"
            clearable
          />
          <span>用于生成java文件的路径</span>
        </el-form-item>
        <el-form-item
          label="前端代码生成路径"
          prop="path"
          required
        >
          <el-input
            v-model="configForm.path"
            clearable
          />
          <span>用于生成前端文件的跟路径,填入当前web项目全路径</span>
        </el-form-item>
        <el-form-item
          label="表前缀"
          prop="prefix"
          required
        >
          <el-input
            v-model="configForm.prefix"
            clearable
          />
          <span>用于生成java文件的命名</span>
        </el-form-item>
        <el-form-item
          label="接口名称"
          prop="apiAlias"
          required
        >
          <el-input
            v-model="configForm.apiAlias"
            clearable
          />
          <span>用于生成前端api文件的命名</span>
        </el-form-item>
        <el-form-item
          label="是否覆盖"
          prop="cover"
          required
        >
          <el-radio-group v-model="configForm.cover">
            <el-radio-button label="true">覆盖</el-radio-button>
            <el-radio-button label="false">不覆盖</el-radio-button>
          </el-radio-group>
          <span>若选择不覆盖且已生成代码，则不生成代码，否则生成代码</span>
        </el-form-item>
        <el-form-item
          label="是否覆盖"
          prop="cover"
          required
        >
          <el-radio-group v-model="configForm.xmlMapper">
            <el-radio-button label="true">生成</el-radio-button>
            <el-radio-button label="false">不生成</el-radio-button>
          </el-radio-group>
          <span>若选择生成,则将生成mapper.xml文件,否则不生成</span>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  columnList,
  saveColumn,
  saveConfig,
  tableConfig,
  genCode
} from '@/api/systool'
import { dictAll } from '@/api/system'
import { myMessage } from '@/utils/message'

export default {
  name: 'ColumnConfig',
  data() {
    return {
      loading: false,
      syncLoading: false,
      saveLoading: false,
      configLoading: false,
      columnList: [],
      dictOptions: [],
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
      ],
      configForm: {
        id: 0,
        tableName: null,
        author: null,
        cover: 1,
        moduleName: null,
        pack: null,
        path: null,
        prefix: null,
        apiAlias: null,
        xmlMapper: null
      },
      configRules: {}
    }
  },
  computed: {
    tableName() {
      return this.$route.params.tableName
    }
  },
  created() {
    this.load()
    this.dict()
    this.tableConfig()
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
    dict() {
      dictAll().then((r) => {
        this.dictOptions = r.data
      })
    },
    tableConfig() {
      tableConfig(this.tableName).then((r) => {
        if (r.data.tableName !== null) {
          this.configForm = r.data
        }
      })
    },
    saveColumn() {
      this.saveLoading = true
      this.columnList.forEach((item) => {
        item.tableName = this.tableName
      })
      saveColumn(this.columnList).then((r) => {
        myMessage()
        this.saveLoading = false
        this.load()
      })
    },
    saveConfig(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.configForm.tableName = this.tableName
          saveConfig(this.configForm).then((r) => {
            myMessage()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    genCode() {
      genCode(this.tableName).then((r) => {})
    }
  }
}
</script>

<style scoped>
.card-title {
  font-size: 16px;
  font-weight: 600;
}

.generator-card {
  margin-bottom: 15px;
}

.clearfix .el-button {
  float: right;
  margin: 0 3px;
}

.table-config-form .el-input {
  width: 40%;
}
</style>
