<template>
  <div class="package-manage">
    <div class="toolbar">
      <el-button type="primary" @click="showDialog = true">+ 新增套餐</el-button>
    </div>

    <el-table :data="packages" border stripe style="width: 100%">
      <el-table-column prop="name" label="套餐名称" min-width="150" />
      <el-table-column label="价格" width="100">
        <template #default="{ row }">¥{{ row.price }}</template>
      </el-table-column>
      <el-table-column label="包含项目" min-width="200">
        <template #default="{ row }">
          <span v-for="(item, idx) in (row.packageProducts || [])" :key="idx">
            {{ item.product?.name }}<span v-if="idx < (row.packageProducts?.length || 0) - 1">，</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">{{ row.status === 1 ? '上架' : '下架' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" @click="handleToggle(row)">{{ row.status === 1 ? '下架' : '上架' }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 套餐编辑对话框 -->
    <el-dialog v-model="showDialog" :title="editingPackage ? '编辑套餐' : '新增套餐'" width="600px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="套餐名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number v-model="form.price" :min="0" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="包含项目">
          <el-transfer v-model="form.productIds" :data="allProducts" filterable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="saving">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import api from '@/api'

const packages = ref<any[]>([])
const allProducts = ref<any[]>([])
const showDialog = ref(false)
const editingPackage = ref<any>(null)
const saving = ref(false)
const form = ref({ name: '', price: 0, description: '', productIds: [] as number[] })

async function fetchPackages() {
  try {
    const res: any = await api.get('/admin/packages?pageSize=200')
    packages.value = res.list || []
  } catch {}
}

async function fetchProducts() {
  try {
    const res: any = await api.get('/admin/products?pageSize=200')
    allProducts.value = (res.list || []).map((p: any) => ({ key: p.id, label: p.name }))
  } catch {}
}

function handleEdit(row: any) {
  editingPackage.value = row
  form.value = {
    name: row.name,
    price: Number(row.price) || 0,
    description: row.description || '',
    productIds: (row.packageProducts || []).map((pp: any) => pp.productId),
  }
  showDialog.value = true
}

async function handleSave() {
  saving.value = true
  try {
    if (editingPackage.value) {
      await api.put(`/admin/packages/${editingPackage.value.id}`, form.value)
      ElMessage.success('更新成功')
    } else {
      await api.post('/admin/packages', form.value)
      ElMessage.success('创建成功')
    }
    showDialog.value = false
    editingPackage.value = null
    form.value = { name: '', price: 0, description: '', productIds: [] }
    fetchPackages()
  } catch {
    ElMessage.error('操作失败')
  } finally {
    saving.value = false
  }
}

async function handleToggle(row: any) {
  await api.put(`/admin/packages/${row.id}`, { status: row.status === 1 ? 0 : 1 })
  ElMessage.success(row.status === 1 ? '已下架' : '已上架')
  fetchPackages()
}

onMounted(() => {
  fetchPackages()
  fetchProducts()
})
</script>

<style scoped>
.package-manage { max-width: 1200px; }
.toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}
</style>
