import {
  ISpeedLog,
  ISpeedTestDownload,
  ISpeedTestPing, ISpeedTestResult,
  ISpeedTestStart, ISpeedTestUpload,
} from "./types"

export default (
  log?: ISpeedLog,
  testStart?: ISpeedTestStart,
  ping?: ISpeedTestPing,
  download?: ISpeedTestDownload,
  upload?: ISpeedTestUpload,
  result?: ISpeedTestResult) => `
## H1 log
${ log?.message }
## H2 testStart
${ testStart?.isp }
${ testStart?.server }
${ testStart?.interface }
${ testStart?.timestamp }
## H3 ping
${ ping?.ping }
${ ping?.timestamp }
#### H4 download
${ download?.download }
${ download?.timestamp }
##### H5 upload
${ upload?.upload }
###### H6 result
${ result?.result }
`