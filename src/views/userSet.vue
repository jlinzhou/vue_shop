<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.key" placeholder="username" clearable prefix-icon="el-icon-search" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" @clear="handleFilter" />

      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ "搜索" }}
      </el-button>
      <el-button v-if="permissionList.add" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ "添加" }}
      </el-button>
      <el-button v-if="permissionList.del" class="filter-item" type="danger" icon="el-icon-delete" @click="handleBatchDel">
        {{ "删除" }}
      </el-button>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" stripe :data="list" border fit highlight-current-row style="width: 100%;" @sort-change="sortChange" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="用户Id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="真实姓名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.realname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.parytof }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="usings" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.usings | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="360" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button v-if="permissionList.view" size="mini" type="success" @click="handleDetail(row.userId)">
            {{ "查看" }}
          </el-button>
          <el-button v-if="permissionList.update" type="primary" size="mini" @click="handleUpdate(row.userId)">
            {{ "编辑" }}
          </el-button>
          <el-button v-if="permissionList.del" size="mini" type="danger" @click="handleDelete(row)">
            {{ "删除" }}
          </el-button>
          <el-button v-if="permissionList.setadminrole" type="primary" size="small" @click="handleSetRole(row)">
            {{ "分配角色" }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" v-loading="loading" element-loading-text="正在执行" element-loading-background="rgba(255,255,255,0.7)" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户Id" prop="userId">
          <el-input v-model.number="temp.userId" disabled />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" :disabled="dialogStatus === 'create' ? false : true" />
        </el-form-item>
        <el-form-item v-if="dialogStatus === 'create' ? true : false" label="密码" prop="password">
          <el-input v-model="temp.password" placeholder="3-20位" show-password minlength="6" maxlength="20" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realname">
          <el-input v-model="temp.realname" />
        </el-form-item>
        <el-form-item label="部门" prop="parytof">
          <el-select v-model="temp.parytof" style="width: 140px" class="filter-item">
            <el-option v-for="item in department" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="部门" prop="parytof">
					<el-input v-model="temp.parytof" />
				</el-form-item> -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item label="状态" prop="usings">
          <el-radio-group v-model.number="temp.usings" type="number">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">暂停使用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="memo">
          <el-input v-model="temp.memo" />
        </el-form-item>
      </el-form>
      <div
        v-if="
          dialogStatus !== 'detail' ? (loading === true ? false : true) : false
        "
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          {{ "取消" }}
        </el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
          {{ "确定" }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogFormVisibleSetRole" :title="dialogFormVisibleSetRoleTitle">
      <el-form v-loading="loading" element-loading-text="正在执行" element-loading-background="rgba(255,255,255,0.7)" label-width="80px" label-position="left">
        <el-form-item>
          <el-tree ref="tree" :check-strictly="false" :data="treeData" :props="treeProps" show-checkbox default-expand-all node-key="id" class="permission-tree" />
        </el-form-item>
      </el-form>
      <div v-if="loading === true ? false : true" style="text-align:right;">
        <el-button type="danger" @click="dialogFormVisibleSetRole = false">
          {{ "取消" }}
        </el-button>
        <el-button type="primary" @click="setRole()">
          {{ "确定" }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { requestMenuButton } from '@/api/app/tradeSys/menu'
import { requestAll as requestAllRole } from '@/api/app/tradeSys/role'
import { requestDepartment } from '@/api/app/tradeSys/setInfo'
import { requestList, requestDetail, requestUpdate, requestCreate, requestDelete, requestAdminsRoleIDList, requestSetRole } from '@/api/app/tradeSys/userSet'

import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { checkAuthAdd, checkAuthDel, checkAuthView, checkAuthUpdate, checkAuthSetadminrole } from '@/utils/permission'

export default {
  name: 'UserSet',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(usings) {
      const statusMap = {
        1: '正常',
        0: '暂停使用'
      }
      return statusMap[usings]
    }
  },
  data() {
    return {
      operationList: [],
      permissionList: {
        add: false,
        del: false,
        view: false,
        update: false,
        setadminrole: false
      },

      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      loading: true,
      listQuery: {
        page: 1,
        limit: 20,
        key: undefined,
        usings: undefined,
        sort: '-userId'
      },
      department: [],
      sortOptions: [
        { label: 'userId Ascending', key: '+userId' },
        { label: 'userId Descending', key: '-userId' },
        { label: 'usings Ascending', key: '+usings' },
        { label: 'usings Descending', key: '-usings' }
      ],

      temp: {
        userId: 0,
        username: '',
        password: '',
        realName: '',
        parytof: '',
        Email: '@sycapital.com.cn',
        Phone: '',
        Usings: 0,
        Memo: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加',
        detail: '详情'
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ min: 3, max: 20, required: true, message: '长度在 3 到 20 个字符', trigger: 'blur' }]
      },
      multipleSelection: [],
      dialogFormVisibleSetRole: false,
      dialogFormVisibleSetRoleTitle: '编辑角色权限',
      treeProps: {
        children: 'children',
        label: 'name'
      },
      treeData: []
    }
  },
  created() {
    this.getMenuButton()
    this.getList()
    this.getTreeData()
    this.getDepartment()
  },
  methods: {
    checkPermission() {
      this.permissionList.add = checkAuthAdd(this.operationList)
      this.permissionList.del = checkAuthDel(this.operationList)
      this.permissionList.view = checkAuthView(this.operationList)
      this.permissionList.update = checkAuthUpdate(this.operationList)
      this.permissionList.setadminrole = checkAuthSetadminrole(this.operationList)
    },
    getMenuButton() {
      requestMenuButton('UserSet').then(response => {
        this.operationList = response.data
      }).then(() => {
        this.checkPermission()
      })
    },
    getList() {
      this.listLoading = true
      requestList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    getDepartment() {
      requestDepartment().then(response => {
        this.department = response.data
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (order === 'ascending') {
        this.listQuery.sort = '+' + prop
      } else if (order === 'descending') {
        this.listQuery.sort = '-' + prop
      } else {
        this.listQuery.sort = undefined
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        userId: 0,
        username: '',
        password: '',
        realName: '',
        parytof: '',
        Email: '@sycapital.com.cn',
        Phone: '',
        Usings: 0,
        Memo: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.loading = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          requestCreate(this.temp).then(response => {
            this.temp.userId = response.data.userId
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.total = this.total + 1
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    handleDetail(id) {
      console.log(id)
      this.loading = true
      requestDetail(id).then(response => {
        this.loading = false
        this.temp = response.data
      })
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(id) {
      this.loading = true
      requestDetail(id).then(response => {
        this.loading = false
        this.temp = response.data
      })
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          const tempData = Object.assign({}, this.temp)
          requestUpdate(tempData).then(() => {
            for (const v of this.list) {
              if (v.userId === this.temp.userId) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    handleDelete(row) {
      var ids = []
      ids.push(row.userId)
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        requestDelete(ids).then(() => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.total = this.total - 1
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleBatchDel() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '未选中任何行',
          type: 'warning',
          duration: 2000
        })
        return
      }
      var ids = []
      for (const v of this.multipleSelection) {
        ids.push(v.userId)
      }
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        requestDelete(ids).then(() => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          for (const row of this.multipleSelection) {
            this.total = this.total - 1
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSetRole(row) {
      this.loading = true
      this.temp = row
      this.dialogFormVisibleSetRole = true
      this.dialogFormVisibleSetRoleTitle = row.user_name + '-分配角色'
      requestAdminsRoleIDList(this.temp.userId).then(response => {
        this.$refs.tree.setCheckedKeys(response.data)
        this.loading = false
      })
    },
    getTreeData() {
      requestAllRole().then(response => {
        if (response.data) {
          this.treeData = this.optionDataSelectTree(response.data)
        }
      })
    },
    optionDataSelectTree(data) {
      const cloneData = JSON.parse(JSON.stringify(data))
      return cloneData.filter(father => {
        const branchArr = cloneData.filter(child => father.userId === child.parentId)
        branchArr.length > 0 ? father.children = branchArr : ''
        return father.parentId === data[0].parentId
      })
    },
    setRole() {
      this.loading = true
      const menuids = this.$refs.tree.getCheckedKeys()
      requestSetRole(this.temp.userId, menuids).then(() => {
        this.dialogFormVisibleSetRole = false
        this.$notify({
          title: '成功',
          message: '设置成功',
          type: 'success',
          duration: 2000
        })
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

