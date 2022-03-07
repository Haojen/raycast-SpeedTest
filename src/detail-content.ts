import {
  ISpeedLog,
  ISpeedTestDownload,
  ISpeedTestPing, ISpeedTestResult,
  ISpeedTestStart, ISpeedTestUpload,
} from "./types"

import { environment } from '@raycast/api'

export default (
  log?: ISpeedLog,
  testStart?: ISpeedTestStart,
  ping?: ISpeedTestPing,
  download?: ISpeedTestDownload,
  upload?: ISpeedTestUpload,
  result?: ISpeedTestResult) => `
## SPEEDTEST
---
Ping: 0ms

Server: **Kirino Net** to -> **Singtel**

### Download

Speed: **100/Mbs**

Progress: [🐰🐰🐰🐰🐰🐰🐰🐰🐰🐰======================] 

### Upload

Speed: **100.22/Mbs**

Progress: [🐢🐢🐢🐢🐢🐢🐢🐢🐢🐢🐢🐢🐢🐢--------------------]

---
Date: 2022:02:02

Get more Speed Test Report: [I'm an inline-style link](https://www.google.com)
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