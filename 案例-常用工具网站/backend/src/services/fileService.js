const path = require('path')
const fs = require('fs')
const { PDFDocument } = require('pdf-lib')

exports.convertToTargetFormat = async (file, targetFormat) => {
  const ext = path.extname(file.originalname).toLowerCase()
  const inputPath = file.path
  let outputPath = inputPath + '.' + targetFormat

  // 示例：docx转txt
  if (ext === '.docx' && targetFormat === 'txt') {
    const mammoth = require('mammoth')
    const result = await mammoth.extractRawText({ path: inputPath })
    fs.writeFileSync(outputPath, result.value)
  } else if (ext === '.txt' && targetFormat === 'pdf') {
    const text = fs.readFileSync(inputPath, 'utf-8')
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage()
    page.drawText(text)
    const pdfBytes = await pdfDoc.save()
    fs.writeFileSync(outputPath, pdfBytes)
  } else {
    throw new Error('暂不支持该格式转换')
  }

  return outputPath
}
