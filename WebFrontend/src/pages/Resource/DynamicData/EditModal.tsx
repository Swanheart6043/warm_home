import { readDynamicData, updateDynamicData } from "@/API/DynamicDataAPI"
import { ProForm, ProFormInstance, ProFormText } from "@ant-design/pro-components"
import NiceModal, { useModal } from "@ebay/nice-modal-react"
import { message, Modal, Spin } from "antd"
import { useEffect, useRef, useState } from "react"

export interface DynamicDataModalProps {
  fieldList: FieldsItem[];
  id: number;
  tableId: number;
  tableName: string;
}

export default NiceModal.create(({ fieldList, id, tableId, tableName }: DynamicDataModalProps) => {
  const modal = useModal();
  const formRef = useRef<ProFormInstance | null>(null)
  const [loading, setLoading] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)

  useEffect(() => {
    const getDetail = async () => {
      if (!id || !tableId || !tableName) {
        console.error('id或tableId或tableName不能为空')
        return
      }
      setLoading(true)
      const result = await readDynamicData(id, tableId, tableName)
      setLoading(false)
      if (!result) return
      formRef.current?.setFieldsValue(result.datas)
    }
    getDetail()
  }, [])

  const submit = async () => {
    if (!id || !tableId || !tableName) {
      console.error('id或tableId或tableName不能为空')
      return
    }
    try {
      await formRef.current?.validateFields()
    } catch {
      return
    }
    try {
      const formData = formRef.current?.getFieldsValue()
      setConfirmLoading(true)
      const result = await updateDynamicData({ ...formData, id, tableId, tableName })
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
      title="编辑数据"
      width={700}
      open={modal.visible}
      onOk={submit}
      onCancel={() => modal.hide()}
      afterClose={() => modal.remove()}
      destroyOnClose={true}
      confirmLoading={confirmLoading}
    >
      <Spin spinning={loading}>
        <ProForm
          formRef={formRef}
          layout="horizontal"
          labelCol={{ span: 4 }}
          submitter={false}
          style={{ maxHeight: '900px', overflow: 'auto' }}
        >
          {fieldList.map(item => (
            <ProFormText
              label={item.columnInfo}
              name={item.columnName}
              placeholder={`请输入${item.columnInfo}`}
            />
          ))}
        </ProForm>
      </Spin>
    </Modal>
  )
})
