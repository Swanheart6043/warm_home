import { PageContainer } from '@ant-design/pro-components'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from './index.module.less'
import { exportHomeDayCharts, exportHomeMonthCharts, exportHomeYearCharts, fetchHomeData, fetchHomeDayCharts, fetchHomeMonthCharts, fetchHomeYearCharts } from '@/API/HomeAPI'
import { Button, DatePicker, message, Select } from 'antd'
import { Column, Line } from '@ant-design/plots'
import moment from 'moment'
import { buildPlatformOptions, PlatformEnum } from '@/enum/PlatformEnum'
import TableArea from './TableArea'

const defaultYear = moment().format('YYYY')
const defaultMonth = [moment().subtract(5, 'M').format('YYYY-MM'), moment().format('YYYY-MM')]
const defaultDay = [moment().subtract(6, 'd').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
const defaultPlatform = PlatformEnum.TK
const defaultColor = ['#80ffa5', '#00ddff', '#37a2ff', '#ff0087', '#ffbf00', '#fb8451', '#9b60b4']
// const defaultColor = ['#fbd896', '#d756b3', '#8e3cb4', '#fe9a85', '#491a9b', '#80ffa5', '#37a2ff']

const Task: React.FC = () => {
  const [page, setPage] = useState<HomeData | undefined>(undefined)
  const pagePlatform = useRef<string>(defaultPlatform)
  const [todayCounts, setTodayCounts] = useState({
    register: 0,
    login: 0,
    maintainAccount: 0,
    publishVideo: 0,
    liveBroadcastRoom: 0,
    privateMessage: 0
  })
  const year = useRef<string>(defaultYear)
  const yearPlatform = useRef<string>(defaultPlatform)
  const month = useRef<string[]>(defaultMonth)
  const monthPlatform = useRef<string>(defaultPlatform)
  const day = useRef<string[]>(defaultDay)
  const dayPlatform = useRef<string>(defaultPlatform)
  const [yearData, setYearData] = useState<HomeCharts[]>([])
  const [monthData, setMonthData] = useState<HomeCharts[]>([])
  const [dayData, setDayData] = useState<HomeCharts[]>([])

  const matchName = (type?: string) => {
    if (type === 'register_account') {
      return '注册'
    }
    if (type === 'account_login') {
      return '登录'
    }
    if (type === 'nurture_account') {
      return '养号'
    }
    if (type === 'video_publish') {
      return '视频发布'
    }
    if (type === 'live_maintenance') {
      return '直播间'
    }
    if (type === 'trace_message') {
      return '私信'
    }
    if (type === 'network_settings') {
      return '网络设置'
    }
    return ''
  }

  const getData = async () => {
    const result = await fetchHomeData(pagePlatform.current)
    setPage(result.data)
  }

  const getYearChart = useCallback(async () => {
    const response = await fetchHomeYearCharts(year.current, yearPlatform.current)
    const result = response?.map(item => ({ ...item, type: matchName(item.type) })) || []
    setYearData(result)
  }, [year])

  const getMonthChart = useCallback(async () => {
    const start = `${month.current[0]}-01`
    const end = moment(month.current[1]).endOf('month').format('YYYY-MM-DD')
    const response = await fetchHomeMonthCharts(start, end, monthPlatform.current)
    const result = response?.map(item => ({ ...item, type: matchName(item.type) })) || []
    setMonthData(result)
  }, [month])

  const getDayChart = useCallback(async () => {
    const response = await fetchHomeDayCharts(day.current[0], day.current[1], dayPlatform.current)
    const result = response?.map(item => ({ ...item, type: matchName(item.type) })) || []
    setDayData(result)
    return result
  }, [day])

  useEffect(() => {
    (async () => {
      getData()
      getYearChart()
      getMonthChart()
      const dayChart = await getDayChart()
      const todayList = dayChart.filter(item => item.date === moment().format('YYYY-MM-DD'))
      setTodayCounts({
        register: todayList.find(item => item.type === '注册')?.value || 0,
        login: todayList.find(item => item.type === '登录')?.value || 0,
        maintainAccount: todayList.find(item => item.type === '养号')?.value || 0,
        publishVideo: todayList.find(item => item.type === '视频发布')?.value || 0,
        liveBroadcastRoom: todayList.find(item => item.type === '直播间')?.value || 0,
        privateMessage: todayList.find(item => item.type === '私信')?.value || 0,
      })
    })()
  }, [])

  const handleNumberChange = (value: string) => {
    pagePlatform.current = value
    getData()
  }

  const handleYearPlatformChange = (value: string) => {
    yearPlatform.current = value
    getYearChart()
  }

  const handleMonthPlatformChange = (value: string) => {
    monthPlatform.current = value
    getMonthChart()
  }

  const handleDayPlatformChange = (value: string) => {
    dayPlatform.current = value
    getDayChart()
  }


  const handleYearChange = (value: any) => {
    year.current = moment(value).format('YYYY')
    getYearChart()
  }

  const handleMonthChange = (value: any) => {
    if (moment(value[1]).diff(moment(value[0]), 'months') > 5) {
      message.warning('开始月份和结束月份不能超过6个月')
      return
    }
    month.current = [
      moment(value[0]).format('YYYY-MM'),
      moment(value[1]).format('YYYY-MM')
    ]
    getMonthChart()
  }

  const handleDayChange = (value: any) => {
    if (moment(value[1]).diff(moment(value[0]), 'days') > 30) {
      message.warning('开始月份和结束月份不能超过31天')
      return
    }
    day.current = [
      moment(value[0]).format('YYYY-MM-DD'),
      moment(value[1]).format('YYYY-MM-DD')
    ]
    getDayChart()
  }

  const handleYearExport = async () => {
    const result = await exportHomeYearCharts(year.current)
    if (!result) return
    const blob = new Blob([result])
    const objectURL = URL.createObjectURL(blob)
    let btn = document.createElement('a')
    btn.download = `年维度任务统计-${moment().format('YYYY-MM-DD HH:mm:ss')}.xls`
    btn.href = objectURL
    btn.click()
    URL.revokeObjectURL(objectURL)
    message.success('导出成功')
  }

  const handleMonthExport = async () => {
    const start = `${month.current[0]}-01`
    const end = moment(month.current[1]).endOf('month').format('YYYY-MM-DD')
    const result = await exportHomeMonthCharts(start, end)
    if (!result) return
    const blob = new Blob([result])
    const objectURL = URL.createObjectURL(blob)
    let btn = document.createElement('a')
    btn.download = `月维度任务统计-${moment().format('YYYY-MM-DD HH:mm:ss')}.xls`
    btn.href = objectURL
    btn.click()
    URL.revokeObjectURL(objectURL)
    message.success('导出成功')
  }

  const handleDayExport = async () => {
    const result = await exportHomeDayCharts(day.current[0], day.current[1])
    if (!result) return
    const blob = new Blob([result])
    const objectURL = URL.createObjectURL(blob)
    let btn = document.createElement('a')
    btn.download = `日维度任务统计-${moment().format('YYYY-MM-DD HH:mm:ss')}.xls`
    btn.href = objectURL
    btn.click()
    URL.revokeObjectURL(objectURL)
    message.success('导出成功')
  }

  return (
    <PageContainer>
      <div className={styles.taskDashboard} style={{ height: 'calc(100vh - 170px)', overflow: 'auto' }}>
        <div style={{ backgroundColor: '#fff', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontWeight: 'bold' }}>
              任务
            </span>
            <Select
              style={{ width: '120px' }}
              options={buildPlatformOptions()}
              value={pagePlatform.current}
              onChange={handleNumberChange}
            />
          </div>

          <div style={{ flex: '1', display: 'flex', gap: '10px' }}>
            <div className={styles.cardArea} style={{ backgroundColor: '#ddf9e4' }}>
              <div className={styles.title}>
                设备数
              </div>
              <div className={styles.number} style={{ color: '#558a53' }}>
                { page?.totalDevices }
              </div>
            </div>
            <div className={styles.cardArea} style={{ backgroundColor: '#deeafc' }}>
              <div className={styles.title}>
                脚本任务总数
              </div>
              <div className={styles.number} style={{ color: '#438bf6' }}>
                { page?.totalTasks }
              </div>
            </div>
            <div className={styles.cardArea} style={{ backgroundColor: '#e1e4fc' }}>
              <div className={styles.title}>
                注册用户总数
              </div>
              <div className={styles.number} style={{ color: '#576DFD' }}>
                { page?.totalAccounts }
              </div>
            </div>
          </div>

          {/* <div style={{ flex: '1', display: 'flex', gap: '10px', backgroundColor: '#fff', padding: '20px' }}>
            <div className={styles.cardArea} style={{ backgroundColor: '#deeafc' }}>
              <div className={styles.title}>
                今日任务数
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', fontSize: '15px' }}>
                <span>注册：{ todayCounts?.register }</span>
                <span>登录：{ todayCounts?.login }</span>
                <span>养号：{ todayCounts?.maintainAccount }</span>
                <span>视频发布：{ todayCounts?.publishVideo }</span>
                <span>直播间：{ todayCounts?.liveBroadcastRoom }</span>
                <span>私信：{ todayCounts?.privateMessage }</span>
              </div>
            </div>
          </div> */}
        </div>

        <div style={{ marginTop: '16px', display: 'flex', gap: '16px' }}>
          <div style={{ flex: '1', backgroundColor: '#fff', padding: '20px' }}>
            <div style={{ paddingBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 'bold' }}>
                年维度任务统计
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Select
                  style={{ width: '120px' }}
                  options={buildPlatformOptions()}
                  value={yearPlatform.current}
                  onChange={handleYearPlatformChange}
                />
                <DatePicker
                  picker="year"
                  value={moment(year.current)}
                  onChange={handleYearChange}
                  allowClear={false}
                />
                <Button type='primary' onClick={handleYearExport}>
                  导出
                </Button>
              </span>
            </div>
            <Column
              height={240}
              color={defaultColor}
              seriesField="type"
              data={yearData}
              xField="type"
              yField="value"
            />
          </div>

          <div style={{ flex: '1', backgroundColor: '#fff', padding: '20px' }}>
            <div style={{ paddingBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 'bold' }}>
                月维度任务统计
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Select
                  style={{ width: '120px' }}
                  options={buildPlatformOptions()}
                  value={monthPlatform.current}
                  onChange={handleMonthPlatformChange}
                />
                <DatePicker.RangePicker
                  picker="month"
                  value={[moment(month.current[0]), moment(month.current[1])]}
                  onChange={handleMonthChange}
                  allowClear={false}
                />
                <Button type='primary' onClick={handleMonthExport}>
                  导出
                </Button>
              </span>
            </div>
            <Line
              height={240}
              color={defaultColor}
              seriesField="type"
              data={monthData}
              xField="date"
              yField="value"
            />
          </div>
        </div>

        <div style={{ marginTop: '16px', backgroundColor: '#fff', padding: '20px' }}>
          <div style={{ paddingBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold' }}>
              日维度任务统计
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Select
                style={{ width: '120px' }}
                options={buildPlatformOptions()}
                value={dayPlatform.current}
                onChange={handleDayPlatformChange}
              />
              <DatePicker.RangePicker
                format="YYYY-MM-DD"
                value={day ? [moment(day.current[0]), moment(day.current[1])] : undefined}
                onChange={handleDayChange}
                allowClear={false}
              />
              <Button type='primary' onClick={handleDayExport}>
                导出
              </Button>
            </span>
          </div>
          <Line
            height={266}
            color={defaultColor}
            seriesField="type"
            data={dayData}
            xField="date"
            yField="value"
          />
        </div>

        <div style={{ marginTop: '16px' }}>
          <TableArea />
        </div>
      </div>
    </PageContainer>
  )
}

export default Task
