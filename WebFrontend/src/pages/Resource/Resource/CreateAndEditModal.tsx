import { importDynamicData } from "@/API/DynamicDataAPI"
import { createResource, fetchAllResourceGroup, readResource, updateResource, uploadResourceFile } from "@/API/ResourceAPI"
import { ErrorText } from "@/components/Text/ErrorText"
import { LinkText } from "@/components/Text/LinkText"
import { checkTxtImport } from "@/util/checkTxtImport"
import { getTxtContent } from "@/util/getTxtContent"
import { ProForm, ProFormInstance, ProFormRadio, ProFormSelect, ProFormText, ProFormTextArea, ProFormUploadButton } from "@ant-design/pro-components"
import NiceModal, { useModal } from "@ebay/nice-modal-react"
import { message, Modal, Spin, Upload } from "antd"
import { useEffect, useRef, useState } from "react"
import { request } from "umi"

const map: { [key: string]: any } = {
  '邮箱资源': {
    tableId: '19',
    tableName: 'email',
    templateName: '邮箱账号导入模版.xls'
  },
  '直播间账号资源': {
    tableId: '24',
    tableName: 'live_room_account',
    templateName: '直播间账号导入模版.xls'
  }
}

export default NiceModal.create(({ id, groupName }: { id: number; groupName: string }) => {
  const modal = useModal();
  const formRef = useRef<ProFormInstance | null>(null)
  const [loading, setLoading] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<ResourceGroup | undefined>(undefined)
  const excelFile = useRef<any | undefined>(undefined)

  useEffect(() => {
    if (!id) return
    const getDetail = async () => {
      setLoading(true)
      const result = await readResource(id)
      setLoading(false)
      if (!result) return
      formRef.current?.setFieldsValue({ ...result.datas, id })
      setSelectedGroup({ id: result.datas?.groupId, name: result.datas?.groupName || groupName })
    }
    getDetail()
  }, [])

  const handleGroupChange = (value: string, option: any) => {
    setSelectedGroup(option)
    formRef.current?.setFieldValue('content', undefined)
  }

  const getTemplate = async () => {
    if (!selectedGroup?.name) {
      message.warning('资源分组不能为空')
      return
    }
    const result = await request<any>(`http://tool.xiaotuicloud.com/${map[selectedGroup.name].templateName}`, {
      method: 'GET',
      responseType: 'blob'
    })
    const blob = new Blob([result])
    const objectURL = URL.createObjectURL(blob)
    let btn = document.createElement('a')
    btn.download = map[selectedGroup.name].templateName
    btn.href = objectURL
    btn.click()
    URL.revokeObjectURL(objectURL)
    message.success('下载成功')
  }

  const submit = async () => {
    const valid = await formRef.current?.validateFields().catch(() => Promise.resolve(false))
    if (!valid) return
    if (!selectedGroup?.name) {
      message.warning('资源分组不能为空')
      return
    }
    try {
      const formValues = formRef.current?.getFieldsValue()
      const formData = new FormData()
      formData.append('name', formValues.name)
      formData.append('groupId', formValues.groupId)
      formData.append('groupName', selectedGroup.name)
      formData.append('content', formValues.content)
      formData.append('comment', formValues.comment || '')
      formData.append('status', formValues.status)
      formData.append('file', excelFile.current || null)
      if (id) {
        formData.append('id', String(id))
      }
      setConfirmLoading(true)
      const result = !id ? await createResource(formData) : await updateResource(formData)
      setConfirmLoading(false)
      if (result.resp_code !== 0) {
        message.error(result.resp_msg)
        return
      }
      message.success(`${ !id ? '新增' : '编辑' }成功`)
      modal.resolve(true)
      modal.remove()
      return
    } catch (error) {
      console.error(error)
      return
    }
  }

  return (
    <Modal
      title={`${ !id ? '新增' : '编辑' }资源`}
      width={600}
      open={modal.visible}
      onOk={submit}
      onCancel={() => modal.hide()}
      afterClose={() => modal.remove()}
      destroyOnClose={true}
      confirmLoading={confirmLoading}
    >
      <Spin spinning={loading}>
        <ProForm formRef={formRef} layout="horizontal" labelCol={{ span: 4 }} submitter={false}>
          <ProFormText
            rules={[{ required: true, message: '名称不能为空' }]}
            label="名称"
            name="name"
            placeholder="请输入名称"
          />

          <ProFormSelect
            rules={[{ required: true, message: '分组不能为空' }]}
            label="分组"
            name="groupId"
            placeholder="请选择分组"
            request={fetchAllResourceGroup}
            fieldProps={{
              fieldNames: { label: 'name', value: 'id' },
              onChange: handleGroupChange
            }}
            disabled={Boolean(id)}
          />

          {[50].includes(selectedGroup?.id || 0) && (
            <ProFormUploadButton
              label="导入图片"
              name="image"
              fieldProps={{
                accept: '.png,.jpg,.jpeg',
                beforeUpload: async (file) => {
                  const rule = ['image/png', 'image/jpg', 'image/jpeg']
                  if (!rule.includes(file.type)) {
                    message.warning('上传文件必须是图片')
                    return Upload.LIST_IGNORE
                  }
                  if (file.size > 500000000) {
                    message.warning('文件大小不能超过500MB')
                    return Upload.LIST_IGNORE
                  }
                  const formData = new FormData()
                  formData.append('file', file)
                  const result = await uploadResourceFile(formData)
                  const lastTxt = formRef.current?.getFieldValue('content') || ''
                  formRef.current?.setFieldValue('content', lastTxt ? lastTxt + '\n' + result.url : lastTxt + result.url)
                  return false
                }
              }}
              extra={<>要求: 大小不超过 <ErrorText>500MB</ErrorText> 格式: <ErrorText>png/jpg/jpeg</ErrorText></>}
            />
          )}

          {[30, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62].includes(selectedGroup?.id || 0) && (
            <ProFormUploadButton
              label="导入Txt"
              name="txt"
              fieldProps={{
                accept: '.txt',
                beforeUpload: async (file) => {
                  if (file.type !== 'text/plain') {
                    message.warning('上传文件必须是txt')
                    return Upload.LIST_IGNORE
                  }
                  if (file.size > 500000000) {
                    message.warning('文件大小不能超过500MB')
                    return Upload.LIST_IGNORE
                  }
                  const canUpload = await checkTxtImport(file)
                  if (!canUpload) return Upload.LIST_IGNORE
                  const txt = await getTxtContent(file)
                  const lastTxt = formRef.current?.getFieldValue('content') || ''
                  formRef.current?.setFieldValue('content', lastTxt ? lastTxt + '\n' + txt : lastTxt + txt)
                  return false
                }
              }}
              extra={(
                <>
                  要求: 大小不超过 <ErrorText>500MB</ErrorText> 格式: <ErrorText>txt</ErrorText>，
                  文本中一行是一个资源
                </>
              )}
            />
          )}

          {[51, 37].includes(selectedGroup?.id || 0) && (
            <ProFormUploadButton
              label="导入Excel"
              name="excel"
              fieldProps={{
                accept: '.xlsx,.xls',
                beforeUpload: async (file) => {
                  const typeList = [
                    'application/vnd.ms-excel',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                  ]
                  if (!typeList.includes(file.type)) {
                    message.error('上传文件必须是excel')
                    return Upload.LIST_IGNORE
                  }
                  try {
                    const formData = new FormData()
                    formData.append('file', file)
                    excelFile.current = file
                    const result = await importDynamicData(formData)
                    if (!result.fileAbsPath) {
                      message.warning('导入错误')
                      return Upload.LIST_IGNORE
                    }
                    formRef.current?.setFieldValue('content', result.fileAbsPath)
                    return false
                  } catch(error) {
                    message.error(error)
                    return Upload.LIST_IGNORE
                  }
                }
              }}
              addonAfter={<LinkText onClick={getTemplate}>模板下载</LinkText>}
            />
          )}

          <ProFormTextArea
            rules={[{ required: true, message: '请导入内容' }]}
            label="内容"
            name="content"
            placeholder="请导入内容"
            disabled
          />

          <ProFormTextArea
            label="备注"
            name="comment"
            placeholder="请输入备注"
          />

          <ProFormRadio.Group
            label="状态"
            name="status"
            options={[{label: '正常', value: 0}, {label: '停用', value: 1}]}
            initialValue={0}
          />
        </ProForm>
      </Spin>
    </Modal>
  )
})
