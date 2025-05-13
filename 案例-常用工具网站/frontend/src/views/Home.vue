<template>
  <div class="home">
    <!-- 顶部Banner -->
    <header class="banner">
      <div class="banner-content">
        <div class="banner-title">
          <h1>常用工具一站式平台</h1>
          <p>轻松实现文件与图片的多种处理</p>
          <el-button type="primary" size="large" plain>点击了解</el-button>
        </div>
      </div>
    </header>

    <!-- 功能导航区 -->
    <section class="features">
      <h2>我们的服务</h2>
      <div class="feature-list">
        <div class="feature-card" v-for="item in features" :key="item.title" @click="handleFeatureClick(item)">
          <component :is="item.icon" class="feature-icon" />
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="footer">
      <span>© 2024 常用工具平台 | 让效率更高效</span>
    </footer>
  </div>
</template>

<script setup>
import { Document, Picture, Crop, Switch, Watermelon } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeMenu = '1'
const features = [
  { title: '文件转换', desc: '快速转换各种文件格式', icon: Document, path: '/file-convert' },
  { title: '图片压缩', desc: '无损压缩图片', icon: Picture, path: '/image-compress' },
  { title: '图片裁剪', desc: '自由裁剪图片尺寸', icon: Crop, path: '/image-crop' },
  { title: '图片格式转换', desc: '支持多种图片格式转换', icon: Switch, path: '/image-convert' },
  { title: '图片水印', desc: '添加自定义水印', icon: Watermelon, path: '/image-watermark' }
]

const handleFeatureClick = (feature) => {
  router.push(feature.path)
}
</script>

<style lang="scss" scoped>
.home {
  min-height: 100vh;
  background: #f6f8fa;
  .banner {
    position: relative;
    background: #2563eb;
    color: #fff;
    padding-bottom: 60px;
    .banner-content {
      position: relative;
      z-index: 2;
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px 0 20px;
      .banner-title {
        text-align: center;
        margin-top: 120px;
        h1, p {
          color: #fff;
          text-shadow: 0 2px 8px rgba(0,0,0,0.10);
        }
        h1 {
          font-size: 2.8rem;
          font-weight: 800;
          margin-bottom: 16px;
        }
        p {
          font-size: 1.2rem;
          margin-bottom: 32px;
        }
      }
    }
  }
  .features {
    max-width: 1100px;
    margin: -40px auto 0 auto;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    padding: 48px 32px 32px 32px;
    h2 {
      text-align: center;
      color: #409EFF;
      font-size: 2rem;
      margin-bottom: 32px;
    }
    .feature-list {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 32px;
      .feature-card {
        flex: 1 1 180px;
        min-width: 180px;
        max-width: 220px;
        background: #f6f8fa;
        border-radius: 12px;
        padding: 32px 16px;
        text-align: center;
        box-shadow: 0 2px 8px rgba(64,158,255,0.08);
        transition: box-shadow 0.2s;
        &:hover {
          box-shadow: 0 4px 24px rgba(64,158,255,0.18);
        }
        .feature-icon {
          font-size: 2.5rem;
          color: #409EFF;
          margin-bottom: 16px;
        }
        h3 {
          font-size: 1.2rem;
          margin-bottom: 8px;
        }
        p {
          color: #666;
          font-size: 1rem;
        }
      }
    }
  }
  .footer {
    text-align: center;
    color: #999;
    padding: 32px 0 16px 0;
    font-size: 1rem;
    background: transparent;
  }
}
</style> 