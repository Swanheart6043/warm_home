import { RcFile } from "antd/lib/upload"

export const getTxtContent = async (file: RcFile): Promise<string> => {
  if (!file.type.includes('text')) {
    return Promise.resolve('')
  }

  const reader = new FileReader()
  reader.readAsText(file)
  const txt = await new Promise((res, rej) => {
    reader.onload = (event) => res(reader.result)
    reader.onerror = (event) => rej(event)
  })

  if (typeof(txt) !== 'string') {
    return Promise.resolve('')
  }
  return Promise.resolve(txt.replace(/\r/g, ''))
}
