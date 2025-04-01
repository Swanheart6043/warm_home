import { ProForm, ProFormDateTimeRangePicker, ProFormDependency, ProFormDigit, ProFormGroup, ProFormRadio, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import { PlatformEnum } from '../../../enum/PlatformEnum';
import { buildOperationTypeForValueJson, ScriptTypeEnum } from "../ScriptTypeEnum";
import { ModalSelect } from '@/components/Select/DeviceSelect';
import { executeScript } from '@/API/ScriptAPI';
import { useState } from 'react';
import { useModel } from 'umi';
import { ScriptParams } from '@/API/ScriptTypings';
import { fetchAllResource } from '@/API/ResourceAPI';
import { fetchAllVideoGroup } from '@/API/ResourceVideoAPI';
import { addIdForValueJson, matchTenantForValueJson, matchUserForValueJson } from '../Util';

const videoReleTitleKey = '标题文案资源'
const videoTrailerSetUrlKey = '产品链接资源'

/**
 * 发布视频
 * @returns
 */
export const PublishVideoForm = () => {
  const [videoReleTitleUrl, ] = useState<string | undefined>(undefined)
  const [videoTrailerSetUrl, ] = useState<string | undefined>(undefined)
  const { initialState } = useModel('@@initialState')
  const { currentUser } = initialState || {}

  const formatRequestParams = (values: any): ScriptParams => {
    const matchVideoReleMusicreg = (value?: number | string) => {
      if (value == 0) return '原音大配音小'
      if (value == 1) return '原音小配音大'
      return ''
    }
    const matchVideoReleMusmeth = (value?: number | string) => {
      if (value == 0) return '热门音乐'
      if (value == 1) return '商业音乐'
      return ''
    }
    const valueJson = [
      { type: '', key: '功能选项', value: '发布视频', options: buildOperationTypeForValueJson() },
      { type: '', key: '发布方式', value: values.videoMode, options: [] },
      { type: '', key: '视频文案', value: values.videoReleTitle, options: [] },
      { type: '', key: '视频', value: values.videoGroup, options: [] },
      { type: '2', key: '音乐音量调整', value: matchVideoReleMusicreg(values.videoReleMusicreg), options: ['原音小配音大','原音大配音小'] },
      { type: '2', key: '音乐选项', value: matchVideoReleMusmeth(values.videoReleMusmeth), options: ['热门音乐', '商业音乐'] },
      { type: '', key: '任务数', value: values.videoReleNum, options: [] },
      { type: '', key: '挂车设置', value: values.videoTrailerSetnum, options: [] },
      { type: '', key: '指定产品链接', value: values.videoTrailerSetUrl, options: [] },
      { type: '', key: '操作用户', value: matchUserForValueJson(currentUser), options: [] },
      { type: '', key: '租户', value: matchTenantForValueJson(currentUser), options: [] },
    ]
    return {
      ...values,
      operType: ScriptTypeEnum.PublishVideo,
      platform: PlatformEnum.TK,
      devices: values.equips.map((item: Device) => item.deviceNo),
      videoReleTitle: videoReleTitleUrl,
      videoTrailerSetUrl,
      valueJson: JSON.stringify(addIdForValueJson(valueJson)),
      scriptAutoTime: values.scriptAutoTime?.[0],
      endTime: values.scriptAutoTime?.[1]
    }
  }

  const submit = async (values: any) => {
    try {
      const params = formatRequestParams(values)
      const result = await executeScript(params)
      if (result.resp_code !== 0) {
        message.error(result.resp_msg)
        return
      }
      message.success('提交成功')
    } catch (error) {
      console.error(error)
      return
    }
  }

  return (
    <div style={{ backgroundColor: '#fff', padding: '20px' }}>
      <ProForm layout="horizontal" onFinish={submit}>
        <ProFormRadio.Group
          label="发布方式"
          name="videoMode"
          options={[{ label: '本机发布', value: '本机发布' }, { label: '下载发布', value: '下载发布' }]}
          initialValue="本机发布"
        />

        <ProForm.Item rules={[{ required: true, message: '设备不能为空' }]} label="设备" name="equips">
          <ModalSelect />
        </ProForm.Item>

        <ProFormDigit
          rules={[{ required: true, message: '任务数不能为空', validator: (_, value) => value > 0 ? Promise.resolve() : Promise.reject('任务数不能小于0') }]}
          label="任务数"
          name="videoReleNum"
          placeholder="请输入任务数"
          width="md"
        />

        <ProFormSelect
          rules={[{ required: true, message: '标题不能为空' }]}
          label="标题文案"
          name="videoReleTitle"
          placeholder="请选择标题"
          request={async () => {
            const step1 = await fetchAllResource()
            const step2 = step1.filter(item => item.groupName === videoReleTitleKey)
            const final = step2.map(item => ({ label: item.name, value: item.name }))
            return final
          }}
          fieldProps={{style: { width: '150px' }}}
        />

        <ProFormDependency name={['videoMode']}>
          {({ videoMode }) => {
            if (videoMode === '本机发布') return <></>
            return (
              <ProFormSelect
                rules={[{ required: true, message: '标题不能为空' }]}
                label="视频"
                name="videoGroup"
                placeholder="请选择视频"
                request={async () => {
                  const step1 = await fetchAllVideoGroup()
                  const final = step1.map(item => ({ label: item.categoryName, value: item.categoryName }))
                  return final
                }}
                fieldProps={{style: { width: '150px' }}}
              />
            )
          }}
        </ProFormDependency>

        <ProFormGroup>
          <ProFormRadio.Group
            label="视频音乐类型"
            name="videoReleMusmeth"
            options={[{label: '热门随机', value: 0}, {label: '商业音乐', value: 1}, {label: '指定音乐', value: 2}]}
            initialValue={0}
          />
          <ProFormDependency name={['videoReleMusmeth']}>
            {({ videoReleMusmeth }) => {
              if (videoReleMusmeth !== 2) return <></>
              return (
                <ProFormText
                  rules={[{ required: true, message: '指定音乐不能为空' }]}
                  label="指定音乐名字"
                  name="videoReleDesmusic"
                />
              )
            }}
          </ProFormDependency>
        </ProFormGroup>

        <ProFormRadio.Group
          rules={[{ required: true, message: '音乐调节不能为空' }]}
          name="videoReleMusicreg"
          label="音乐调节"
          options={[{label: '原音大配音小', value: 0}, {label: '原音小配音大', value: 1}]}
          initialValue={0}
        />

        <ProFormText
          name="videoTrailerSetnum"
          label="挂车设置"
          placeholder="请输入挂车"
          fieldProps={{ suffix: "号商品" }}
          width="md"
        />

        <ProFormSelect
          label="指定产品链接导入"
          name="videoTrailerSetUrl"
          placeholder="请选择文本"
          request={async () => {
            const step1 = await fetchAllResource()
            const step2 = step1.filter(item => item.groupName === videoTrailerSetUrlKey)
            const final = step2.map(item => ({ label: item.name, value: item.name }))
            return final
          }}
          fieldProps={{style: { width: '150px' }}}
        />

        <ProForm.Group>
          <ProFormRadio.Group
            label="启动方式"
            name="scriptTimesetMeth"
            options={[{ label: '立即启动', value: 0 }, { label: '定时启动', value: 1 }]}
            initialValue={0}
          />
          <ProFormDependency name={['scriptTimesetMeth']}>
            {({ scriptTimesetMeth }) => {
              if (scriptTimesetMeth !== 1) return <></>
              return (
                <ProFormDateTimeRangePicker
                  rules={[{ required: true, message: '定时设置不能为空' }]}
                  label="定时设置"
                  name="scriptAutoTime"
                />
              )
            }}
          </ProFormDependency>
        </ProForm.Group>
      </ProForm>
    </div>
  )
}
