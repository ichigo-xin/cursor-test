const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const PDFDocument = require('pdfkit')

// 配置文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 限制50MB
  }
})

// 文件转换接口
router.post('/convert/file', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '没有上传文件' })
    }

    const targetFormat = req.body.targetFormat
    if (!targetFormat) {
      return res.status(400).json({ error: '未指定目标格式' })
    }

    const inputFile = req.file.path
    const outputFile = inputFile.replace(path.extname(inputFile), `.${targetFormat}`)

    // 根据不同的转换类型进行转换
    if (path.extname(inputFile).toLowerCase() === '.txt' && targetFormat === 'pdf') {
      // TXT 转 PDF
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50
      })

      // 创建写入流
      const writeStream = fs.createWriteStream(outputFile)
      doc.pipe(writeStream)

      // 读取 TXT 文件内容
      const content = fs.readFileSync(inputFile, 'utf-8')
      
      // 设置字体和大小
      doc.font('Helvetica')
         .fontSize(12)
         .text(content, {
           align: 'left',
           lineGap: 5
         })

      // 完成 PDF 生成
      doc.end()

      // 等待写入完成
      await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve)
        writeStream.on('error', reject)
      })

    } else {
      return res.status(400).json({ error: '不支持的转换类型' })
    }

    // 检查转换后的文件是否存在
    if (!fs.existsSync(outputFile)) {
      return res.status(500).json({ error: '文件转换失败' })
    }

    // 返回下载链接
    const downloadUrl = `/uploads/${path.basename(outputFile)}`
    console.log('生成下载链接:', downloadUrl)
    res.json({ downloadUrl })

  } catch (error) {
    console.error('文件转换错误:', error)
    res.status(500).json({ error: '文件转换失败' })
  }
})

// 文件下载接口
router.get('/download/:filename', (req, res) => {
  try {
    const file = path.join(__dirname, '../../uploads', req.params.filename)
    console.log('尝试下载文件:', file)

    // 检查文件是否存在
    if (!fs.existsSync(file)) {
      console.error('文件不存在:', file)
      return res.status(404).json({ error: '文件不存在' })
    }

    // 获取文件信息
    const stat = fs.statSync(file)
    console.log('文件大小:', stat.size, '字节')

    // 设置响应头
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Length', stat.size)
    res.setHeader('Content-Disposition', `attachment; filename=${req.params.filename}`)

    // 创建文件读取流
    const fileStream = fs.createReadStream(file)
    
    // 处理流错误
    fileStream.on('error', (error) => {
      console.error('文件读取错误:', error)
      if (!res.headersSent) {
        res.status(500).json({ error: '文件读取失败' })
      }
    })

    // 将文件流传输到响应
    fileStream.pipe(res)

  } catch (error) {
    console.error('文件下载错误:', error)
    if (!res.headersSent) {
      res.status(500).json({ error: '文件下载失败' })
    }
  }
})

module.exports = router
