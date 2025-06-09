import axios from "axios"
import type { Response, ResponseList, Control, Environmenta, ControlRequest } from "./apiType"

export const fetchControlData = async () => {
  const result = await axios.get<Response<Control>>('/cgi-bin/control.cgi')
  return result.data
}

export const updateLamp = async (params: ControlRequest) => {
  const result = await axios.post<Response<null>>('/cgi-bin/lamp.cgi', params)
  return result.data
}

export const updateSpeakers = async (params: ControlRequest) => {
  const result = await axios.post<Response<null>>('/cgi-bin/speakers.cgi', params)
  return result.data
}

export const updateFan = async (params: ControlRequest) => {
  const result = await axios.post<Response<null>>('/cgi-bin/fan.cgi', params)
  return result.data
}

export const updateDigitalTube = async (params: ControlRequest) => {
  const result = await axios.post<Response<null>>('/cgi-bin/lamp_special.cgi', params)
  return result.data
}

export const fetchEnvironmentalData = async () => {
  const result = await axios.get<Response<Environmenta>>('/cgi-bin/env.cgi')
  return result.data
}

export const fetchPhotoWall = async () => {
  const result = await axios.get<ResponseList<string>>('/cgi-bin/photo.cgi')
  return result.data
}