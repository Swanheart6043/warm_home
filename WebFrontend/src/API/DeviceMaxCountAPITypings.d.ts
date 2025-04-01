
interface MaxDeviceRequest {
  schemad?: string
  maxDevices?: number
}

interface MaxDeviceResponse {
  id?: number
  schemad?: string
  maxDevices?: number
  usedEquips?: number
}
