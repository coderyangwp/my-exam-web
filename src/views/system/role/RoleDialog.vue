<template>
    <div>
        <el-dialog
            v-if="visible"
            :title="title"
            :visible="visible"
            @close="handlerClose(false)"
        >
            <el-form
                ref="ruleForm"
                :model="ruleForm"
                :rules="rules"
                label-width="100px"
                class="demo-ruleForm"
            >
                                    <el-form-item
                        label="名称"
                        prop="name"
                    >
                            <el-input v-model="ruleForm.name" clearable />
                    </el-form-item>
                    <el-form-item
                        label="角色级别"
                        prop="level"
                    >
                            <el-input v-model="ruleForm.level" clearable />
                    </el-form-item>
                    <el-form-item
                        label="描述"
                        prop="description"
                    >
                            <el-input v-model="ruleForm.description" clearable />
                    </el-form-item>
                    <el-form-item
                        label="数据权限"
                        prop="dataScope"
                    >
                            <el-input v-model="ruleForm.dataScope" clearable />
                    </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { detail, save } from '@/api/role'
import { myMessage } from '@/utils/message'

    export default {
        name: 'RoleDialog',
        props: {
            roleId: {
                type: Number,
                default: 0
            },
            title: {
                type: String,
                default: ''
            },
            visible: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                ruleForm: {
                            name: null,
                            level: null,
                            description: null,
                            dataScope: null,
                    roleId: 0
                },
                rules: {
                            name: [{required: true, message: '请输入名称'}],
                            level: [{required: true, message: '请输入角色级别'}],
                            description: [{required: true, message: '请输入描述'}],
                            dataScope: [{required: true, message: '请输入数据权限'}],
                }
            }
        },
        watch: {
            id(val) {
                if (val > 0) {
                    this.init()
                    this.ruleForm.roleId = val
                }
            }
        },
        methods: {
            init() {
                detail(this.roleId).then((res) => {
                    this.ruleForm = res.data
                })
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        save(this.ruleForm).then((response) => {
                            myMessage()
                            this.handlerClose(true)
                        })
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            },
            handlerClose(reload) {
                this.$refs['ruleForm'].clearValidate()
                Object.assign(this.ruleForm, this.$options.data().ruleForm)
                this.$emit('closeDialog', { reload })
            }
        }
    }
</script>
