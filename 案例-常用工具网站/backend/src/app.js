const express = require('express')
const cors = require('cors')
const path = require('path')
const fileRoutes = require('./routes/file')

const app = express()

// 启用 CORS
app.use(cors())

// 解析 JSON 和 URL 编码的请求体
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 提供上传目录的静态文件访问
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// 注册文件路由
app.use('/api', fileRoutes)

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err)
  res.status(500).json({ error: '服务器内部错误' })
})

// 处理 404 错误
app.use((req, res) => {
  console.error('404 Not Found:', req.url)
  res.status(404).json({ error: '请求的资源不存在' })
})

module.exports = app
