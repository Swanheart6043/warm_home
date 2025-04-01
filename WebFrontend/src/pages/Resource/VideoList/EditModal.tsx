import { fetchAllVideoGroup, updateVideo, uploadVideo } from "@/API/ResourceVideoAPI"
import { ErrorText } from "@/components/Text/ErrorText"
import { ProForm, ProFormInstance, ProFormSelect, ProFormTextArea, ProFormUploadButton } from "@ant-design/pro-components"
import NiceModal, { useModal } from "@ebay/nice-modal-react"
import { message, Modal, Upload } from "antd"
import { useEffect, useRef, useState } from "react"

export default NiceModal.create((row: Video) => {
  const modal = useModal();
  const formRef = useRef<ProFormInstance | null>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [videoInfo, setVideoInfo] = useState<any | undefined>(undefined)
  const categoryName = useRef<string | undefined>(undefined)

  useEffect(() => {
    const getDetail = async () => {
      if (!row?.id) {
        console.error('id不能为空')
        return
      }
      formRef.current?.setFieldsValue({ ...row, categoryId: Number(row.categoryId) })
      setVideoInfo(row)
    }
    setTimeout(() => getDetail())
  }, [])

  const submit = async () => {
    if (!row?.id) {
      console.error('id不能为空')
      return
    }
    const valid = await formRef.current?.validateFields().catch(() => Promise.resolve(false))
    if (!valid) return
    try {
      const formData = formRef.current?.getFieldsValue()
      setConfirmLoading(true)
      const params = {
        ...videoInfo,
        ...formData,
        categoryName: categoryName.current
      }
      const result = await updateVideo(params)
      setConfirmLoading(false)
      if (result.resp_code !== 0) {
        message.error(result.resp_msg)
        return
      }
      message.success('编辑成功')
      modal.resolve(true)
      modal.remove()
    } catch (error) {
      message.error(error)
    }
  }

  return (
    <Modal
      title="编辑视频"
      width={700}
      open={modal.visible}
      onOk={submit}
      onCancel={() => modal.hide()}
      afterClose={() => modal.remove()}
      destroyOnClose={true}
      confirmLoading={confirmLoading}
    >
      <ProForm formRef={formRef} layout="horizontal" labelCol={{ span: 3 }} submitter={false}>
        <ProFormSelect
          rules={[{ required: true, message: '视频分组不能为空' }]}
          label="视频分组"
          name="categoryId"
          placeholder="请选择视频分组"
          request={fetchAllVideoGroup}
          fieldProps={{
            fieldNames: { label: 'categoryName', value: 'id' },
            onChange: (_, option: any) => categoryName.current = option?.label
          }}
        />

        <ProFormUploadButton
          rules={[{ validator: () => videoInfo ? Promise.resolve() : Promise.reject('视频文件不能为空') }]}
          label="视频文件"
          name="video"
          required
          fieldProps={{
            accept: '.mp4',
            beforeUpload: async (file) => {
              if (file.type !== 'video/mp4') {
                message.warning('上传文件必须是MP4')
                return Upload.LIST_IGNORE
              }
              if (file.size > 100000000) {
                message.warning('不能大于100MB')
                return Upload.LIST_IGNORE
              }
              const formData = new FormData()
              formData.append('file', file)
              const result = await uploadVideo(formData)
              setVideoInfo(result)
              formRef.current?.setFieldValue('content', result.url)
              return false
            },
            onChange: (value) => {
              if (value.file?.status !== "removed") return
              setVideoInfo(undefined)
            },
            fileList: videoInfo ? [videoInfo] : []
          }}
          extra={<>要求: 大小不超过 <ErrorText>100MB</ErrorText></>}
        />

        <ProFormTextArea label="备注" name="comment" placeholder="请输入备注" />
      </ProForm>
    </Modal>
  )
})
