<template>
  <div class="home-config">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="Banner 配置" name="banners">
        <div class="config-section">
          <div v-for="(banner, idx) in config.banners" :key="idx" class="config-item">
            <el-input v-model="banner.text" placeholder="Banner文字" style="width:200px" />
            <el-input v-model="banner.subText" placeholder="副标题" style="width:200px" />
            <el-input v-model="banner.link" placeholder="链接" style="width:200px" />
            <el-button type="danger" size="small" @click="removeBanner(idx)">删除</el-button>
          </div>
          <el-button type="primary" size="small" @click="addBanner" class="add-btn">+ 添加Banner</el-button>
        </div>
      </el-tab-pane>

      <el-tab-pane label="热门车型" name="brands">
        <div class="config-section">
          <el-select v-model="config.hotBrands" multiple filterable allow-create default-first-option style="width:400px" placeholder="选择/输入热门车型">
            <el-option v-for="brand in availableBrands" :key="brand" :label="brand" :value="brand" />
          </el-select>
        </div>
      </el-tab-pane>

      <el-tab-pane label="热门商品" name="products">
        <div class="config-section">
          <el-transfer v-model="config.hotProductIds" :data="allProducts" filterable />
        </div>
      </el-tab-pane>

      <el-tab-pane label="精选套餐" name="packages">
        <div class="config-section">
          <el-transfer v-model="config.hotPackageIds" :data="allPackages" filterable />
        </div>
      </el-tab-pane>
    </el-tabs>

    <div class="save-bar">
      <el-button type="primary" size="large" @click="handleSave" :loading="saving">保存配置</el-button>
      <el-button size="large" @click="handlePreview">预览效果</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import api from '@/api'

const activeTab = ref('banners')
const saving = ref(false)
const availableBrands = ['问界', '理想', '小米SU7', '比亚迪', '特斯拉', '蔚来', '极氪', '宝马', '奔驰', '奥迪']
const allProducts = ref<any[]>([])
const allPackages = ref<any[]>([])

const config = reactive({
  banners: [{ text: '蓝辉轻改 · 专业轻改装', subText: '品质服务 · 品牌保障', link: '' }],
  hotBrands: ['问界', '理想', '小米SU7'],
  hotProductIds: [] as number[],
  hotPackageIds: [] as number[],
})

function addBanner() {
  config.banners.push({ text: '', subText: '', link: '' })
}

function removeBanner(idx: number) {
  config.banners.splice(idx, 1)
}

async function fetchConfig() {
  try {
    const res: any = await api.get('/home/config')
    if (res.banners) config.banners = res.banners
    if (res.hotBrands) config.hotBrands = res.hotBrands
  } catch {}
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

async function handleSave() {
  saving.value = true
  try {
    await api.put('/admin/home/config', config)
    ElMessage.success('配置保存成功')
  } catch {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

function handlePreview() {
  ElMessage.info('预览功能即将上线')
}

onMounted(() => {
  fetchConfig()
  fetchProducts()
  fetchPackages()
})
</script>

<style scoped>
.home-config { max-width: 800px; }
.config-section {
  padding: 16px 0;
}
.config-item {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  align-items: center;
}
.add-btn { margin-top: 8px; }
.save-bar {
  position: sticky;
  bottom: 0;
  background: #fff;
  padding: 20px 0;
  border-top: 1px solid #e8ebf4;
  display: flex;
  gap: 12px;
}
</style>
