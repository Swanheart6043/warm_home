import axios from "axios"
import type { Response, ControlRow, Control, Environmenta } from "./apiType"

export const fetchControlData = async () => {
  const result = await axios.get<Response<Control>>('/cgi-bin/control.cgi')
  return result.data
}

export const updateLamp = async (params: unknown) => {
  const result = await axios.post<Response<null>>('/cgi-bin/control_lamp.cgi', params)
  return result.data
}

export const updateSpeakers = () => {
  const result = axios.post('/cgi-bin/control_speakers.cgi')
  return result
}

export const updateFan = () => {
  const result = axios.post('/cgi-bin/control_fan.cgi')
  return result
}

export const updateDigitalTube = () => {
  const result = axios.post('/cgi-bin/control_lamp_special.cgi')
  return result
}

export const fetchEnvironmentalData = async () => {
  const result = await axios.get<Response<Environmenta>>('/cgi-bin/environment.cgi')
  return result.data
}

export const fetchMonitor = async () => {
  await axios.get<{[key: string]: ControlRow[]}, {[key: string]: ControlRow[]}>('/cgi-bin/monitor.cgi')
  return []
}

export const fetchPhotoWall = async () => {
  await axios.get<{[key: string]: ControlRow[]}, {[key: string]: ControlRow[]}>('/cgi-bin/photo.cgi')
  return []
}