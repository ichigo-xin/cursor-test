<template>
    <div class="file-convert-page">
      <section class="convert-tool">
        <div class="support-tip">
          <el-alert
            title="支持格式：Word（.doc/.docx）、PDF、Excel（.xls/.xlsx）、TXT"
            type="info"
            show-icon
            :closable="false"
          />
        </div>
        <el-upload
          class="upload-area"
          drag
          :action="uploadUrl"
          :on-success="handleSuccess"
          :on-error="handleError"
          :show-file-list="false"
          :data="{ targetFormat }"
          :before-upload="beforeUpload"
          :headers="headers"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">拖拽文件到这里，或 <em>点击上传</em></div>
          <div class="el-upload__tip">仅支持 Word、PDF、Excel、TXT 文件</div>
        </el-upload>
        <div class="convert-options">
          <el-select v-model="targetFormat" placeholder="请选择目标格式" style="width: 200px;">
            <el-option v-for="item in formats" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </section>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import { UploadFilled } from '@element-plus/icons-vue'
  
  const formats = [
    { label: 'Word (.docx)', value: 'docx' },
    { label: 'PDF (.pdf)', value: 'pdf' },
    { label: 'Excel (.xlsx)', value: 'xlsx' },
    { label: 'TXT (.txt)', value: 'txt' }
  ]
  const targetFormat = ref('')
  const uploadUrl = 'http://localhost:3000/api/convert/file'
  const headers = {
    'Accept': 'application/json'
  }
  
  function handleSuccess(response) {
    if (response && response.downloadUrl) {
      const downloadUrl = `http://localhost:3000${response.downloadUrl}`
      window.open(downloadUrl, '_blank')
      ElMessage.success('转换成功，正在下载...')
    } else {
      console.error('转换失败，响应数据:', response)
      ElMessage.error('转换失败：服务器返回数据格式不正确')
    }
  }
  
  function handleError(error, file) {
    console.error('上传错误:', error)
    console.error('上传失败的文件:', file)
    
    let errorMessage = '上传或转换失败'
    if (error.status === 413) {
      errorMessage = '文件太大，请压缩后重试'
    } else if (error.status === 415) {
      errorMessage = '不支持的文件格式'
    } else if (error.status === 500) {
      errorMessage = '服务器处理失败，请稍后重试'
    }
    
    ElMessage.error(errorMessage)
  }
  
  function beforeUpload(file) {
    console.log('准备上传文件:', file)
    
    if (!targetFormat.value) {
      ElMessage.warning('请先选择目标格式')
      return false
    }
    
    // 检查文件大小（限制为50MB）
    const isLt50M = file.size / 1024 / 1024 < 50
    if (!isLt50M) {
      ElMessage.error('文件大小不能超过 50MB!')
      return false
    }
    
    // 检查文件类型
    const allowedTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt']
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
    if (!allowedTypes.includes(fileExt)) {
      ElMessage.error('不支持的文件格式！')
      return false
    }
    
    return true
  }
  </script>
  
  <style scoped>
  .file-convert-page {
    max-width: 500px;
    margin: 60px auto 0 auto;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    padding: 32px 24px 24px 24px;
  }
  .support-tip {
    margin-bottom: 24px;
  }
  .upload-area {
    margin-bottom: 24px;
  }
  .convert-options {
    text-align: center;
  }
  .el-icon--upload {
    font-size: 48px;
    color: #409EFF;
    margin-bottom: 16px;
  }
  .el-upload__text {
    color: #606266;
    font-size: 14px;
    margin: 8px 0;
  }
  .el-upload__tip {
    color: #909399;
    font-size: 12px;
  }
  </style>
  