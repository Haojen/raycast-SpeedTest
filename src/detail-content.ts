import {
  ISpeedLog,
  ISpeedTestDownload,
  ISpeedTestPing, ISpeedTestResult,
  ISpeedTestStart, ISpeedTestUpload,
} from "./types"

import { environment } from '@raycast/api'
// {"id":13623,"host":"speedtest.singnet.com.sg","port":8080,"name":"Singtel","location":"Singapore","country":"Singapore","ip":"165.21.70.1"}
// {"internalIp":"192.168.2.106","name":"en0","macAddr":"F4:D4:88:80:6B:DB","isVpn":false,"externalIp":"222.129.130.228"}
export default (
  log?: ISpeedLog,
  testStart?: ISpeedTestStart,
  ping?: ISpeedTestPing,
  download?: ISpeedTestDownload,
  upload?: ISpeedTestUpload,
  result?: ISpeedTestResult) => `
## SPEEDTEST
>>>
Ping: ${ping?.ping.latency || 0}ms

You IP: ${ testStart?.interface.externalIp }

ISP: ${ testStart?.isp } -> ${ testStart?.server.name } (${ testStart?.server.location  })

### Download
Speed: **${download?.download.bandwidth}**

Progress: [${ download?.download.progressUI }] ${(download?.download.progress || 0)}%

### Upload

Speed: **${upload?.upload.bandwidth}s**

Progress: [${ upload?.upload.progressUI }] ${(upload?.upload.progress || 0)}%
>>>
---
**Interface**

Name: ${ testStart?.interface.name }

Mac Address: ${ testStart?.interface.macAddr }
 
Local IP: ${ testStart?.interface.internalIp }
>>>
**Server**

IP: ${ testStart?.server.ip}

Country: ${ testStart?.server.country}

Host: ${ testStart?.server.host }
>>>
Date: 2022:02:02

Report ID: xxxxxx
>>>
---
## About

**SPEEDTEST** *Power by ©OOKLA️*
`
//
// ## H1 log
// ${ log?.message }
// ## H2 testStart
// ${ testStart?.isp }
// ${ JSON.stringify(testStart?.server) }
// ${ testStart?.interface }
// ${ testStart?.timestamp }
// ## H3 ping
// ${ JSON.stringify(ping?.ping) }
// ${ ping?.timestamp }
// #### H4 download
// ${ JSON.stringify(download)}
// ${ download?.timestamp }
// ##### H5 upload
// ${ JSON.stringify(upload?.upload) }
// ###### H6 result
// ${ JSON.stringify(result?.result) }