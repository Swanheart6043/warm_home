import axios from "axios"
import type { Response, ResponseList, Control, Environmenta, ControlRequest } from "./apiType"

export const fetchControlData = async () => {
  const result = await axios.get<Response<Control>>('/api/control')
  return result.data
}

export const updateLamp = async (params: ControlRequest) => {
  const result = await axios.post<Response<null>>('/api/lamp', params)
  return result.data
}

export const updateSpeakers = async (params: ControlRequest) => {
  const result = await axios.post<Response<null>>('/api/speakers', params)
  return result.data
}

export const updateFan = async (params: ControlRequest) => {
  const result = await axios.post<Response<null>>('/api/fan', params)
  return result.data
}

export const fetchEnvironmentalData = async () => {
  const result = await axios.get<Response<Environmenta>>('/api/env')
  return result.data
}

export const fetchPhotoWall = async () => {
  const result = await axios.get<ResponseList<string>>('/api/photo')
  return result.data
}