<template>
  <div class="store-manage">
    <div class="toolbar">
      <el-input v-model="search" placeholder="搜索门店..." clearable style="width:240px" />
      <el-button type="primary" @click="showDialog = true">+ 新增门店</el-button>
    </div>

    <el-table :data="stores" border stripe style="width: 100%">
      <el-table-column prop="name" label="门店名称" min-width="150" />
      <el-table-column prop="address" label="地址" min-width="200" show-overflow-tooltip />
      <el-table-column prop="phone" label="电话" width="140" />
      <el-table-column prop="businessHours" label="营业时间" width="120" />
      <el-table-column label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">{{ row.status === 1 ? '启用' : '停用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" @click="handleConfigProducts(row)">商品配置</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)" v-if="row.status === 1">停用</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 门店编辑对话框 -->
    <el-dialog v-model="showDialog" :title="editingStore ? '编辑门店' : '新增门店'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="营业时间">
          <el-input v-model="form.businessHours" placeholder="如: 9:00-18:00" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="saving">保存</el-button>
      </template>
    </el-dialog>

    <!-- 商品配置对话框 -->
    <el-dialog v-model="showProductConfig" title="配置门店商品" width="600px">
      <el-tabs v-model="configTab">
        <el-tab-pane label="商品配置" name="products">
          <el-transfer
            v-model="selectedProducts"
            :data="allProducts"
            :titles="['可选商品', '已选商品']"
            filterable
          />
        </el-tab-pane>
        <el-tab-pane label="套餐配置" name="packages">
          <el-transfer
            v-model="selectedPackages"
            :data="allPackages"
            :titles="['可选套餐', '已选套餐']"
            filterable
          />
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <el-button @click="showProductConfig = false">取消</el-button>
        <el-button type="primary" @click="handleSaveConfig">保存配置</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/api'

const search = ref('')
const stores = ref<any[]>([])
const allProducts = ref<any[]>([])
const allPackages = ref<any[]>([])
const showDialog = ref(false)
const showProductConfig = ref(false)
const editingStore = ref<any>(null)
const currentStoreId = ref('')
const configTab = ref('products')
const selectedProducts = ref<number[]>([])
const selectedPackages = ref<number[]>([])
const saving = ref(false)
const form = ref({ name: '', address: '', phone: '', businessHours: '' })

async function fetchStores() {
  try {
    const res: any = await api.get('/stores')
    stores.value = res.list
  } catch {
    // 使用空数据
  }
}

async function fetchProducts() {
  try {
    const res: any = await api.get('/admin/products?pageSize=200')
    allProducts.value = (res.list || []).map((p: any) => ({ key: p.id, label: p.name }))
  } catch {}
}

async function fetchPackages() {
  try {
    const res: any = await api.get('/admin/packages?pageSize=200')
    allPackages.value = (res.list || []).map((p: any) => ({ key: p.id, label: p.name }))
  } catch {}
}

function handleEdit(row: any) {
  editingStore.value = row
  form.value = { name: row.name, address: row.address, phone: row.phone, businessHours: row.businessHours || '' }
  showDialog.value = true
}

async function handleConfigProducts(row: any) {
  currentStoreId.value = row.id
  configTab.value = 'products'
  try {
    const storeProducts: any = await api.get(`/stores/${row.id}/products`)
    selectedProducts.value = (storeProducts.products || []).map((p: any) => p.id)
    selectedPackages.value = (storeProducts.packages || []).map((p: any) => p.id)
  } catch {}
  showProductConfig.value = true
}

async function handleSave() {
  saving.value = true
  try {
    if (editingStore.value) {
      await api.put(`/stores/${editingStore.value.id}`, form.value)
      ElMessage.success('更新成功')
    } else {
      await api.post('/stores', form.value)
      ElMessage.success('创建成功')
    }
    showDialog.value = false
    editingStore.value = null
    form.value = { name: '', address: '', phone: '', businessHours: '' }
    fetchStores()
  } catch {
    ElMessage.error('操作失败')
  } finally {
    saving.value = false
  }
}

async function handleSaveConfig() {
  try {
    await api.put(`/stores/${currentStoreId.value}/products`, {
      productIds: selectedProducts.value,
      packageIds: selectedPackages.value,
    })
    ElMessage.success('配置保存成功')
    showProductConfig.value = false
  } catch {
    ElMessage.error('保存失败')
  }
}

async function handleDelete(row: any) {
  await ElMessageBox.confirm(`确认停用门店 "${row.name}"？`)
  await api.delete(`/stores/${row.id}`)
  ElMessage.success('已停用')
  fetchStores()
}

onMounted(() => {
  fetchStores()
  fetchProducts()
  fetchPackages()
})
</script>

<style scoped>
.store-manage { max-width: 1200px; }
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
</style>
