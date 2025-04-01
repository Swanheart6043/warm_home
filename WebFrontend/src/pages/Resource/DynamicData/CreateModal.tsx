import { ProFormText, ProForm, ProFormInstance } from "@ant-design/pro-components"
import NiceModal, { useModal } from "@ebay/nice-modal-react"
import { message, Modal } from "antd"
import { useRef, useState } from "react"
import { createDynamicData } from "@/API/DynamicDataAPI"

interface ModalProps {
  selectedTable: DynamicTable;
  fieldList: FieldsItem[];
}

export default NiceModal.create(({ selectedTable, fieldList }: ModalProps) => {
  const modal = useModal();
  const formRef = useRef<ProFormInstance | null>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)

  const submit = async () => {
    try {
      await formRef.current?.validateFields()
    } catch {
      return
    }
    try {
      const params = formRef.current?.getFieldsValue()
      setConfirmLoading(true)
      const result = await createDynamicData({
        ...params,
        tableId: selectedTable.id,
        tableName: selectedTable.tableNameEn
      })
      setConfirmLoading(false)
      if (result.resp_code !== 0) {
        message.error(result.resp_msg)
        return
      }
      message.success('新增成功')
      modal.resolve(true)
      modal.hide()
    } catch(error) {
      message.error(error)
    }
  }

  return (
    <Modal
      title="新增数据"
      width={700}
      open={modal.visible}
      onOk={submit}
      onCancel={() => modal.hide()}
      afterClose={() => modal.remove()}
      confirmLoading={confirmLoading}
    >
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
    </Modal>
  )
})
