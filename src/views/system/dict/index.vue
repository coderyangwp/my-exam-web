<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="10">
        <el-row type="flex" justify="space-between" class="m-b-20">
          <el-col>
            <el-button-group>
              <el-button size="small" icon="el-icon-plus" @click="handlerDictAdd">添加</el-button>
              <el-button type="small" icon="el-icon-edit" @click="handlerDictUpdate">修改</el-button>
              <el-button size="small" icon="el-icon-delete" @click="handlerDictDel">删除</el-button>
            </el-button-group>
          </el-col>
          <el-col class="text-r">
            <el-input
              v-model="queryParams.name"
              size="mini"
              placeholder="请输入字典名称"
              prefix-icon="el-icon-edit"
              clearable
              class="input-w-150 m-r-5"
            />
            <el-button
              size="mini"
              type="default"
              icon="el-icon-search"
              @click="load"
            >
              查询
            </el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-table
            :data="dict"
            ref="DictTable"
            style="width: 100%"
            :border="true"
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            size="mini"
            highlight-current-row
            @current-change="handlerSelectRow"
          >
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="name"
              label="字典名称"
              sortable
            >
            </el-table-column>
            <el-table-column
              prop="code"
              label="字典编码"
              sortable
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
                  :type="scope.row.status === 0 ? 'danger' : 'success'"
                  disable-transitions>{{scope.row.status?'正常':'冻结'}}</el-tag>
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
      <el-col :span="12">
        <el-row type="flex" justify="space-between" class="m-b-20">
          <el-col>
            <el-button-group>
              <el-button size="mini" icon="el-icon-plus" :disabled="currentDict==null" @click="handlerChildAdd">添加</el-button>
              <el-button type="mini" icon="el-icon-edit" @click="handlerChildEdit">修改</el-button>
              <el-button size="mini" icon="el-icon-delete" @click="handlerChildDel">删除</el-button>
            </el-button-group>
          </el-col>
        </el-row>
        <el-row>
          <el-table
            :data="dictChild"
            ref="ChildTable"
            style="width: 100%"
            :border="true"
            size="mini"
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            highlight-current-row
          >
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="name"
              label="值"
            >
            </el-table-column>
            <el-table-column
              prop="code"
              label="代码"
              sortable
            >
            </el-table-column>
          </el-table>
        </el-row>
      </el-col>
    </el-row>
    <dict-dialog :dict="dictDialog" @closeDict="closeDict" />
    <dict-child :child="childDialog" @closeChild="closeChild" />
  </div>
</template>
<script>
import { dictList, dictDetail, delDict, deleteDictChild } from '@/api/system'
import { myMessage, myConfirm } from '@/utils/message'
import DictDialog from '@/views/system/dict/DictDialog'
import DictChild from '@/views/system/dict/DictChild'

export default {
  name: 'Dict',
  components: {
    DictDialog,
    DictChild
  },
  data() {
    return {
      dict: [],
      dictChild: [],
      total: 0,
      queryParams: {
        current: 1,
        size: 10,
        name: ''
      },
      dictDialog: {
        visible: false,
        title: '新增字典',
        id: 0,
        name: null,
        code: null,
        descript: null,
        status: null
      },
      currentDict: null,
      childDialog: {
        visible: false,
        title: '新增字典项',
        id: 0,
        dictCode: null,
        name: null,
        code: null
      }
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      dictList(this.queryParams).then(response => {
        this.dict = response.data.records
        this.total = response.data.total
      })
    },
    // 获取
    handleCurrentChange(current) {
      this.queryParams.current = current
    },
    // 点击字典，查看该字典的子数据
    handlerSelectRow(currentRow) {
      if (currentRow == null) {
        this.dictChild = []
        return
      }
      this.currentDict = currentRow
      dictDetail(currentRow.code).then(res => {
        this.dictChild = res.data.dictDetails
      })
    },
    // 添加字典
    handlerDictAdd() {
      this.dictDialog.visible = true
      this.dictDialog.title = '添加字典'
    },
    // 编辑字典 只能选一条
    handlerDictUpdate() {
      let data = this.$refs.DictTable.selection
      if (data.length !== 1) {
        myMessage('warning', '请选择字典')
        return
      }
      data = data[0]
      // 删除多余属性
      delete data.current
      delete data.size
      // 字典数据传递给子组件 不用再去数据库查询
      this.dictDialog = JSON.parse(JSON.stringify(data))
      this.dictDialog.visible = true
      this.dictDialog.title = '编辑字典'
    },
    // 删除字典 可多选
    handlerDictDel() {
      const data = this.$refs.DictTable.selection
      if (data.length === 0) {
        myMessage('error', '请选择字典')
        return
      }
      myConfirm('确认删除选中字典？').then(() => {
        const ids = []
        // 记录code是为了将vuex中的数据删除
        const codes = []
        data.filter(item => {
          ids.push(item.id)
          codes.push(item.code)
        })
        delDict(ids).then(() => {
          myMessage()
          // 清空之前选中得字段 防止删除字典后还可添加字典项
          this.currentDict = null
          this.load()
          // 根据code删除vuex中的数据
          this.$store.commit('dict/DELETE_DICT', codes)
        })
      })
    },
    // 关闭字典dialog
    closeDict(reload) {
      if (reload) {
        // 新增或修改字典项 获取更新后的值存入vuex中
        this.$store.dispatch('dict/getDict', this.dictDialog.code)
        this.load()
      }
      // 将dictDialog的值恢复至初始化
      this.dictDialog = this.$options.data().dictDialog
    },
    // 添加字典项
    handlerChildAdd() {
      this.childDialog.visible = true
      this.childDialog.title = '新增字典项'
      this.childDialog.dictCode = this.currentDict.code
    },
    // 编辑字典项
    handlerChildEdit() {
      let data = this.$refs.ChildTable.selection
      if (data.length !== 1) {
        myMessage('warning', '请选择字典项')
        return
      }
      data = data[0]
      delete data.current
      delete data.size
      this.childDialog = JSON.parse(JSON.stringify(data))
      this.childDialog.visible = true
      this.childDialog.title = '编辑字典项'
    },
    // 删除字典项
    handlerChildDel() {
      const data = this.$refs.ChildTable.selection
      if (data.length === 0) {
        myMessage('error', '请选择要删除的数据')
        return
      }
      myConfirm('确认删除?').then(() => {
        const ids = []
        data.filter(item => {
          return ids.push(item.id)
        })
        deleteDictChild(ids).then(res => {
          myMessage()
          // 删除vuex中的该字典
          this.$store.commit('dict/DELETE_ONE_DICT', this.currentDict.code)
          this.handlerSelectRow(this.currentDict)
        })
      })
    },
    // 关闭字典项对话框
    closeChild(reload) {
      if (reload) {
        this.handlerSelectRow(this.currentDict)
        // 新增或修改字典项 获取更新后的值存入vuex中
        this.$store.dispatch('dict/getDict', this.childDialog.dictCode)
      }
      this.childDialog = this.$options.data().childDialog
    }
  }
}
</script>

<style scoped>

</style>
