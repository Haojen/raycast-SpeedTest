/*const result = {
  "type":"result","timestamp":"2022-03-05T15:19:14Z",
  "ping":{"jitter":2.3570000000000002,"latency":125.58199999999999},
  "download":{"bandwidth":81526270,"bytes":1066217948,"elapsed":15012},
  "upload":{"bandwidth":4237179,"bytes":57217948,"elapsed":15000},
  "packetLoss":1.0714285714285714,"isp":"Kirino","interface":{"internalIp":"192.168.2.106","name":"en0","macAddr":"F4:D4:88:80:6B:DB","isVpn":false,"externalIp":"222.129.130.228"},
  "server":{"id":13623,"host":"speedtest.singnet.com.sg","port":8080,"name":"Singtel","location":"Singapore","country":"Singapore","ip":"165.21.70.1"},
  "result":{"id":"4b735fec-11ec-4b2e-8fbd-7eb80dd72c56","url":"https://www.speedtest.net/result/c/4b735fec-11ec-4b2e-8fbd-7eb80dd72c56","persisted":true}
}*/

export interface ISpeedTestBasic {
  type: SpeedTestDataType
  timestamp: string
}

export interface ISpeedLog extends ISpeedTestBasic {
  message: string
  level: string
}

export interface ISpeedTestStart extends ISpeedTestBasic {
  isp:string
  interface: ISpeedTestDataInterface
  server: ISpeedTestDataServer
}

export interface ISpeedTestPing extends ISpeedTestBasic {
  // ping
  ping: ISpeedTestDataPing
}

export interface ISpeedTestUpload extends ISpeedTestBasic {
  upload: ISpeedTestDataUploadAndDownload
}

export interface ISpeedTestDownload extends ISpeedTestBasic {
  download: ISpeedTestDataUploadAndDownload
}

export interface ISpeedTestResult extends ISpeedTestBasic {
  result: ISpeedTestDataResult
}

// {"id":"4b735fec-11ec-4b2e-8fbd-7eb80dd72c56","url":"https://www.speedtest.net/result/c/4b735fec-11ec-4b2e-8fbd-7eb80dd72c56","persisted":true}
export interface ISpeedTestDataResult {
  id: number
  url: string
  persisted: boolean
}

// {"bandwidth":2220856,"bytes":12288,"elapsed":5,"progress":0.00036886666666666667}
export interface ISpeedTestDataUploadAndDownload {
  bytes: number
  elapsed: number
  progress: number
  bandwidth: number
  progressUI?: string
}

// {"jitter":0,"latency":129.20099999999999,"progress":0.20000000000000001}
export interface ISpeedTestDataPing {
  jitter: number
  latency: number
  progress: number
}

// {"internalIp":"192.168.2.106","name":"en0","macAddr":"F4:D4:88:80:6B:DB","isVpn":false,"externalIp":"222.129.130.228"}
export interface ISpeedTestDataInterface {
  name: string
  isVpn: boolean
  macAddr: string
  internalIp: string
  externalIp: string
}
// {"id":13623,"host":"speedtest.singnet.com.sg","port":8080,"name":"Singtel","location":"Singapore","country":"Singapore","ip":"165.21.70.1"}
export interface ISpeedTestDataServer {
  id: number
  ip: string
  host: string
  port: number
  name: string
  country: string
  location: string
}
// order by order
export enum SpeedTestDataType {
  testStart = 'testStart',
  Ping = 'ping',
  Download = 'download',
  Upload = 'upload',
  result = 'result'
}