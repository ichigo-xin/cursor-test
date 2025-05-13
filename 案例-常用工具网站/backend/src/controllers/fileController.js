const path = require('path')
const { convertToTargetFormat } = require('../services/fileService')

exports.convertFile = async (req, res) => {
  const file = req.file
  const { targetFormat } = req.body

  if (!file || !targetFormat) {
    return res.status(400).json({ error: '缺少文件或目标格式' })
  }

  try {
    const outputPath = await convertToTargetFormat(file, targetFormat)
    const downloadUrl = `/api/convert/download/${path.basename(outputPath)}`
    res.json({ downloadUrl })
  } catch (err) {
    res.status(500).json({ error: '转换失败', detail: err.message })
  }
}
