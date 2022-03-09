import {
  ISpeedLog,
  ISpeedTestDownload,
  ISpeedTestPing, ISpeedTestResult,
  ISpeedTestStart, ISpeedTestUpload,
} from "./types"

const megabit = 125000
// {"id":13623,"host":"speedtest.singnet.com.sg","port":8080,"name":"Singtel","location":"Singapore","country":"Singapore","ip":"165.21.70.1"}
// {"internalIp":"192.168.2.106","name":"en0","macAddr":"F4:D4:88:80:6B:DB","isVpn":false,"externalIp":"222.129.130.228"}
// "result":{"id":"4b735fec-11ec-4b2e-8fbd-7eb80dd72c56","url":"https://www.speedtest.net/result/c/4b735fec-11ec-4b2e-8fbd-7eb80dd72c56","persisted":true}
export default (
  log?: ISpeedLog,
  testStart?: ISpeedTestStart,
  ping?: ISpeedTestPing,
  download?: ISpeedTestDownload,
  upload?: ISpeedTestUpload,
  result?: ISpeedTestResult) => `
## SPEEDTEST
>>>
📶 Ping: ${ping?.ping.latency || 0}ms

🧑‍💻 You IP: ${ testStart?.interface.externalIp }

📡 ISP: ${ testStart?.isp } -> ${ testStart?.server.name } (${ testStart?.server.location  })

### Download
⏬ Speed: **${((download?.download.bandwidth || 0) / megabit).toFixed(2) }**/Mbps

Progress: ${ download?.download.progressUI } ${(download?.download.progress || 0)}%

### Upload

⏫ Speed: **${((upload?.upload.bandwidth || 0) / megabit).toFixed(2)}/Mbs**

Progress: ${ upload?.upload.progressUI } ${(upload?.upload.progress || 0)}%
>>>
---
**Interface**

Name: ${ testStart?.interface.name }
 
Local IP: ${ testStart?.interface.internalIp }

Mac Address: ${ testStart?.interface.macAddr }
>>>
**Server**

IP: ${ testStart?.server.ip}

Country: ${ testStart?.server.country}

Host: ${ testStart?.server.host }
>>>
Date: ${ testStart?.timestamp }

Report ID: ${ result?.result.id ? result?.result.id : 'Report not created' }
>>>
---
## About

**SPEEDTEST** *Power by ©OOKLA️*
`