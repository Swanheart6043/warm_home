import axios from "axios"
import type { ControlRow } from "./controlType"

export const fetchControlData = async () => {
  await axios.get<{[key: string]: ControlRow[]}, {[key: string]: ControlRow[]}>('/cgi-bin/led.cgi')
  return {
    lamp: [
      { key: '1', name: 'Led1', checked: false },
      { key: '2', name: 'Led2', checked: false },
      { key: '3', name: 'Led3', checked: false },
      { key: '4', name: 'Led4', checked: false },
    ],
    speakers: [
      { key: '1', name: '音箱', checked: false }
    ],
    fan: [
      { key: '1', name: '风扇', checked: false }
    ],
    digitalTube: [
      { key: '1', name: '数码管', checked: false }
    ]
  }
}

export const updateLamp = () => {
  const result = axios.post('/cgi-bin/control.cgi')
  return result
}

export const updateSpeakers = () => {
  const result = axios.post('/cgi-bin/control.cgi')
  return result
}

export const updateFan = () => {
  const result = axios.post('/cgi-bin/control.cgi')
  return result
}

export const updateDigitalTube = () => {
  const result = axios.post('/cgi-bin/control.cgi')
  return result
}