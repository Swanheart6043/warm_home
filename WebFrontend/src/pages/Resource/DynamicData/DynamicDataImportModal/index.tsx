import { message, Modal, Upload, Button } from "antd"
import { RcFile } from "antd/lib/upload";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import styles from './index.module.less'
import { useState } from "react";
import { exportDynamicDataStep2, fetchDynamicDataImportTemplate, importDynamicData, submitImportDynamicData } from "@/API/DynamicDataAPI";

export interface DynamicDataImportModalProps {
  tableId: number;
  tableName: string;
}

export default NiceModal.create(({ tableId, tableName }: DynamicDataImportModalProps) => {
  const modal = useModal()
  const [errorList, setErrorList] = useState<string[]>([])
  const [fileInfo, setFileInfo] = useState<DynamicDataImportResponseParams|undefined>(undefined)
  const [uploadButtonLoading, setUploadButtonLoading] = useState<boolean>(false)
  const [submitButtonLoading, setSubmitButtonLoading] = useState<boolean>(false)

  const downloadTemplate = async () => {
    if (!tableId || !tableName) {
      console.error('tableId和tableName不能为空')
      return
    }
    const { resp_msg } = await fetchDynamicDataImportTemplate(tableId, tableName)
    if (!resp_msg) {
      console.error('resp_msg不能为空')
      return
    }
    const result = await exportDynamicDataStep2(resp_msg)
    if (!result) {
      console.error('动态数据二进制文件不能为空')
      return
    }
    const blob = new Blob([result])
    const objectURL = URL.createObjectURL(blob)
    let btn = document.createElement('a')
    btn.download = '动态数据导入模板.xlsx'
    btn.href = objectURL
    btn.click()
    URL.revokeObjectURL(objectURL)
    message.success('下载成功')
  }

  const uploadExcel = async (file: RcFile) => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    if (file.type !== fileType) {
      message.error('上传文件必须是xlsx')
      return false
    }
    try {
      const formData = new FormData()
      formData.append('file', file)
      setUploadButtonLoading(true)
      const result = await importDynamicData(formData)
      setUploadButtonLoading(false)
      if (!result.fileAbsPath) {
        setErrorList(['导入错误'])
        return Upload.LIST_IGNORE
      }
      setFileInfo(result)
      return false
    } catch(error) {
      message.error(error)
      return false
    }
  }

  const submit = async () => {
    if (!fileInfo) {
      console.error('fileInfo不能为空')
      return
    }
    try {
      setSubmitButtonLoading(true)
      const result = await submitImportDynamicData({
        content: fileInfo.fileAbsPath,
        tableId,
        tableName,
      })
      setSubmitButtonLoading(false)
      if (result.resp_code !== 0) {
        message.error(result.resp_msg)
        return
      }
      message.success('导入成功')
      modal.resolve(true)
      modal.hide()
      return true
    } catch(error) {
      message.error(error)
      return false
    }
  }

  return (
    <Modal
      title="导入动态数据"
      width={600}
      open={modal.visible}
      onOk={submit}
      onCancel={() => modal.hide()}
      afterClose={() => modal.remove()}
      bodyStyle={{ padding: '12px 16px' }}
      confirmLoading={submitButtonLoading}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Upload accept=".xlsx" beforeUpload={uploadExcel}>
          <Button type="primary" loading={uploadButtonLoading}>上传xlsx文件</Button>
        </Upload>
        <span className={styles.downloadButton} onClick={downloadTemplate}>
          模板下载
        </span>
      </div>

      <div className={styles.pathArea}>
        <div>路径：{fileInfo?.url}</div>
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
        <div>1. 下载《动态数据模板》</div>
        <div>2. 打开下载的表格，将对应的字段信息录入至表格内。</div>
        <div>3. 资料录入完成后，点击上方 “上传xlsx文件” 按钮，完成对应xlsx文件选择</div>
      </div>
    </Modal>
  )
})
