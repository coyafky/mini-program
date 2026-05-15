<template>
  <div class="product-manage">
    <div class="toolbar">
      <el-input v-model="search" placeholder="搜索商品..." clearable style="width:200px" />
      <el-select v-model="filterCategory" placeholder="分类" clearable style="width:120px">
        <el-option label="内饰" value="interior" />
        <el-option label="外观" value="exterior" />
        <el-option label="功能" value="function" />
        <el-option label="舒适" value="comfort" />
      </el-select>
      <el-button type="primary" @click="showDialog = true">+ 新增商品</el-button>
    </div>

    <el-table :data="products" border stripe style="width: 100%">
      <el-table-column label="商品名称" prop="name" min-width="150" />
      <el-table-column label="价格" prop="priceDescription" width="120" />
      <el-table-column label="简介" prop="brief" min-width="200" show-overflow-tooltip />
      <el-table-column label="分类" width="100">
        <template #default="{ row }">
          <el-tag>{{ categoryMap[row.category] || row.category }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">{{ row.status === 1 ? '上架' : '下架' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" :type="row.status === 1 ? 'warning' : 'success'" @click="handleToggle(row)">
            {{ row.status === 1 ? '下架' : '上架' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="showDialog" :title="editingProduct ? '编辑商品' : '新增商品'" width="600px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="价格说明">
          <el-input v-model="form.priceDescription" placeholder="如: ¥2,980起" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="form.brief" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.category">
            <el-option label="内饰" value="interior" />
            <el-option label="外观" value="exterior" />
            <el-option label="功能" value="function" />
            <el-option label="舒适" value="comfort" />
          </el-select>
        </el-form-item>
        <el-form-item label="详细介绍">
          <el-input v-model="form.description" type="textarea" :rows="4" />
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
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '@/api'

const search = ref('')
const filterCategory = ref('')
const products = ref<any[]>([])
const showDialog = ref(false)
const editingProduct = ref<any>(null)
const saving = ref(false)
const form = ref({ name: '', priceDescription: '', brief: '', category: 'exterior', description: '' })
const categoryMap: Record<string, string> = { interior: '内饰', exterior: '外观', function: '功能', comfort: '舒适' }

async function fetchProducts() {
  try {
    const params: any = { pageSize: 200 }
    if (search.value) params.keyword = search.value
    if (filterCategory.value) params.category = filterCategory.value
    const res: any = await api.get('/admin/products', { params })
    products.value = res.list || []
  } catch {}
}

function handleEdit(row: any) {
  editingProduct.value = row
  form.value = {
    name: row.name,
    priceDescription: row.priceDescription || '',
    brief: row.brief || '',
    category: row.category || 'exterior',
    description: row.description || '',
  }
  showDialog.value = true
}

async function handleSave() {
  saving.value = true
  try {
    if (editingProduct.value) {
      await api.put(`/admin/products/${editingProduct.value.id}`, form.value)
      ElMessage.success('更新成功')
    } else {
      await api.post('/admin/products', form.value)
      ElMessage.success('创建成功')
    }
    showDialog.value = false
    editingProduct.value = null
    form.value = { name: '', priceDescription: '', brief: '', category: 'exterior', description: '' }
    fetchProducts()
  } catch {
    ElMessage.error('操作失败')
  } finally {
    saving.value = false
  }
}

async function handleToggle(row: any) {
  await api.put(`/admin/products/${row.id}`, { status: row.status === 1 ? 0 : 1 })
  ElMessage.success(row.status === 1 ? '已下架' : '已上架')
  fetchProducts()
}

onMounted(() => { fetchProducts() })
</script>

<style scoped>
.product-manage { max-width: 1200px; }
.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
</style>
