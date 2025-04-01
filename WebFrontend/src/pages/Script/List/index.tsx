import { paginationScript, reRunScript, stopScript } from '@/API/ScriptAPI'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { PageContainer, ProFormDateRangePicker, ProFormSelect, ProTable, QueryFilter } from '@ant-design/pro-components'
import React, { useRef, useState } from 'react'
import { buildPlatformOptions } from '../../../enum/PlatformEnum'
import { buildOperationTypeOptions } from "../ScriptTypeEnum"
import { message, Popconfirm, Space, Tag } from 'antd'
import { LinkText } from '@/components/Text/LinkText'
import { ErrorText } from '@/components/Text/ErrorText'
import { ScriptItem } from '@/API/ScriptTypings'

const matchScriptType = (value?: number | string) => {
  if (value == 1) return "注册账号"
  if (value == 2) return "账号登录"
  if (value == 3) return "养号功能"
  if (value == 4) return "视频发布"
  if (value == 5) return "直播维护"
  if (value == 6) return "留痕私信"
  if (value == 7) return "设置代理"
  if (value == 8) return "取消代理"
  if (value == 9) return "修改头像"
  return ""
}

const ScriptManagementList: React.FC = () => {
  const [params, setParams] = useState<Record<string, string | number>>({});
  const actionRef = useRef<ActionType>(null)

  const handleEnable = (row: ScriptItem) => async () => {
    if (!row.scriptId) return
    try {
      const result = await reRunScript({ scriptId: row.scriptId })
      if (result.resp_code !== 0) {
        message.error(result.resp_msg)
        return
      }
      message.success('执行成功')
      actionRef.current?.reload()
    } catch (error) {
      message.error(error)
    }
  }

  const handleStop = (row: ScriptItem) => async () => {
    if (!row.scriptId) return
    try {
      const result = await stopScript({ scriptId: row.scriptId })
      if (result.resp_code !== 0) {
        message.error(result.resp_msg)
        return
      }
      message.success('停止成功')
      actionRef.current?.reload()
    } catch (error) {
      message.error(error)
    }
  }

  const columns: ProColumns<ScriptItem>[] = [
    {
      title: '任务编号',
      dataIndex: 'scriptId',
    },
    {
      title: '任务类型',
      dataIndex: 'operType',
      render: (_, entity) => matchScriptType(entity.operType)
    },
    {
      title: '平台',
      dataIndex: 'platform',
    },
    {
      title: '执行方式',
      dataIndex: 'scriptTimesetMeth',
      width: 80,
      render: (_, entity) => {
        if (entity.scriptTimesetMeth == 0) {
          return '立即执行'
        }
        if (entity.scriptTimesetMeth == 1) {
          return '定时执行'
        }
        return '-'
      }
    },
    {
      title: '开始下发时间',
      dataIndex: 'scriptAutoTime',
      width: 150,
    },
    {
      title: '停止下发时间',
      dataIndex: 'endTime',
      width: 150,
    },
    {
      title: '执行状态',
      dataIndex: 'isEnabled',
      width: 80,
      render: (_, entity) => {
        if (entity.isEnabled === 0) {
          return <Tag color="success">正常</Tag>
        }
        if (entity.isEnabled === 1) {
          return <Tag color="error">停用</Tag>
        }
        return '-'
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 150,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 80,
      render: (_, entity, index, action) => {
        return (
          <Space>
            <Popconfirm title="确定重新执行吗?" onConfirm={handleEnable(entity)}>
              <LinkText>执行</LinkText>
            </Popconfirm>
            <Popconfirm title="确定停止吗?" onConfirm={handleStop(entity)}>
              <ErrorText pointer>停止</ErrorText>
            </Popconfirm>
          </Space>
        )
      }
    },
  ];

  return (
    <PageContainer>
      <QueryFilter defaultCollapsed split className="query-filter" onFinish={async (values) => setParams({ ...values, createTimeBegin: values?.dataRange?.[0], createTimeEnd: values?.dataRange?.[1] })}>
        <ProFormSelect name="osType" label="任务类型" options={buildOperationTypeOptions()} />
        <ProFormSelect name="osPlatform" label="所属平台" options={buildPlatformOptions()} />
        <ProFormSelect name="isEnabled" label="执行状态" options={[{label: '正常', value: 0}, {label: '停用', value: 1}]} />
        <ProFormDateRangePicker name="dataRange" label="创建时间" />
      </QueryFilter>

      <ProTable<ScriptItem>
        rowKey="id"
        actionRef={actionRef}
        request={paginationScript}
        columns={columns}
        search={false}
        params={params}
        pagination={{ showSizeChanger: true, showQuickJumper: false }}
      />
    </PageContainer>
  );
};

export default ScriptManagementList;
