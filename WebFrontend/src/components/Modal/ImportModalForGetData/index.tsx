import { message, Modal, Upload, Button } from "antd"
import { RcFile } from "antd/lib/upload";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { request } from "umi";
import styles from './index.module.less'
import { useState } from "react";
import { PlatformEnum } from "@/enum/PlatformEnum";

interface ImportModalProps {
  title: string
  downloadFileName: string
  importRequest: (params: { platform: PlatformEnum }, file: any) => Promise<OptionalResultList<string>>,
  params: { platform: PlatformEnum }
}

const ImportModalForGetData = NiceModal.create(({ title, downloadFileName, importRequest, params }: ImportModalProps) => {
  const modal = useModal()
  const [errorList, setErrorList] = useState<string[]>([])

  const downloadRequest = async () => {
    const result = await request<any>(`http://tool.xiaotuicloud.com/${downloadFileName}`, {
      method: 'GET',
      responseType: 'blob'
    })
    return result
  }

  const downloadTemplate = async () => {
    if (!downloadRequest) {
      return
    }
    const result = await downloadRequest()
    if (!result) {
      return
    }
    const blob = new Blob([result])
    const objectURL = URL.createObjectURL(blob)
    let btn = document.createElement('a')
    btn.download = downloadFileName
    btn.href = objectURL
    btn.click()
    URL.revokeObjectURL(objectURL)
    message.success('下载成功')
  }

  const importData = async (file: RcFile) => {
    const typeList = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
    if (!typeList.includes(file.type)) {
      message.error('上传文件必须是excel')
      return false
    }
    if (!importRequest) {
      return false
    }
    try {
      const formData = new FormData()
      formData.append('file', file)
      message.loading('正在导入')
      const result = await importRequest({ platform: params.platform }, formData)
      message.destroy()
      if (result.resp_code !== 0) {
        const afterFormat = result.resp_msg?.split(';').filter(text => text)
        setErrorList(afterFormat || [])
        return Upload.LIST_IGNORE
      }
      message.success('导入成功')
      modal.resolve(result.datas)
      modal.hide()
      return false
    } catch(error) {
      message.error(error)
    }
    return false
  }

  return (
    <Modal
      title={ (title || '') + '批量导入'}
      width={600}
      open={modal.visible}
      onCancel={() => modal.hide()}
      afterClose={() => modal.remove()}
      footer={null}
      bodyStyle={{ padding: '12px 16px' }}
      centered
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Upload accept=".xls,.xlsx" beforeUpload={importData}>
          <Button type="primary">导入{title || ''}</Button>
        </Upload>
        <span className={styles.downloadButton} onClick={downloadTemplate}>
          模板下载
        </span>
      </div>

      {Boolean(errorList.length) && (
        <div className={styles.errorArea}>
          {errorList.map(text => (
            <div>{text}</div>
          ))}
        </div>
      )}

      <div style={{ fontSize: '12px', color: '#1f2329' }}>
        <div style={{ margin: '12px 0px 6px 0px' }}>导入步骤：</div>
        <div>1. 下载《{ title || '' }批量导入模板》</div>
        <div>2. 打开下载的表格，将对应的字段信息录入至表格内。</div>
        <div>3. 资料录入完成后，点击上方 “导入{ title || '' }” 按钮，完成对应xlsx xls文件选择</div>
      </div>
    </Modal>
  )
})

export default ImportModalForGetData
