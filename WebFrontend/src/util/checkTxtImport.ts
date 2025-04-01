import { message } from "antd"
import { RcFile } from "antd/lib/upload"

export const checkTxtImport = async (file: RcFile) => {
  if (!file.type.includes('text')) {
    message.error('上传文件必须是txt')
    return Promise.resolve(false)
  }
  if (file.size === 0) {
    message.error('文件内容不能为空')
    return Promise.resolve(false)
  }
  const reader = new FileReader()
  reader.readAsText(file)
  const txt = await new Promise((res, rej) => {
    reader.onload = (event) => res(reader.result)
    reader.onerror = (event) => rej(event)
  })
  if (typeof(txt) !== 'string') {
    message.error('文件内容必须是文本')
    return Promise.resolve(false)
  }
  const lines = txt.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line?.trim() === '') {
      message.error(`文件第${i + 1}行不能为空`)
      return Promise.resolve(false)
    }
  }
  return Promise.resolve(true)
}
