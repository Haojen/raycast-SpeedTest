import { useEffect, useState } from "react"
import { spawn } from 'node:child_process'
import { Detail, ActionPanel, Action, Icon } from "@raycast/api"
import readme from "./detail-content"
import mockData from "./log"
import {
  ISpeedLog,
  ISpeedTestBasic,
  ISpeedTestDownload,
  ISpeedTestPing,
  ISpeedTestResult,
  ISpeedTestStart,
  ISpeedTestUpload,
  SpeedTestDataType
} from "./types"
/*
* TODO:
* 1. Copy result, and extension and author info
* 2. Recent Test History
* */
const PROGRESS_PREFIX_FILL = '︎▪︎'
const PROGRESS_AMOUNT = 20
const PROGRESS_PREFIX_UPLOAD = Array(PROGRESS_AMOUNT).fill('▫︎')
const PROGRESS_PREFIX_DOWNLOAD = Array(PROGRESS_AMOUNT).fill('▫︎')
let timer: NodeJS.Timeout | null = null

let isSpeedTestRuning = false

export default function() {
  const [stateIsSpeedTesting, setStateIsSpeedTesting] = useState(true)
  const [stateSpeedTestLog, setStateSpeedTestLog] = useState<ISpeedLog>()
  const [stateSpeedTestStart, setStateSpeedTestStart] = useState<ISpeedTestStart>()
  const [stateSpeedTestPing, setStateSpeedTestPing] = useState<ISpeedTestPing>()
  const [stateSpeedTestDownload, setStateSpeedTestDownload] = useState<ISpeedTestDownload>()
  const [stateSpeedTestUpload, setStateSpeedTestUpload] = useState<ISpeedTestUpload>()
  const [stateSpeedTestResult, setStateSpeedTestResult] = useState<ISpeedTestResult>()

  const [stateSpeedTestMarkdownContent, setStateSpeedTestMarkdownContent] = useState<string>('')

  function stdout(data: ISpeedTestBasic){
    console.log('sin',data)
    if (data.type === SpeedTestDataType.testStart) {
      setStateSpeedTestStart(data as ISpeedTestStart)
      return
    }
    if (data.type === SpeedTestDataType.Ping) {
      setStateSpeedTestPing(data as ISpeedTestPing)
      return
    }
    if (data.type === SpeedTestDataType.Download) {
      const download = data as ISpeedTestDownload
      const progressNumber = Math.floor(download.download.progress * (PROGRESS_AMOUNT - 1))

      for (let i = 0; i <= progressNumber; i++) {
        PROGRESS_PREFIX_DOWNLOAD[i] = PROGRESS_PREFIX_FILL
      }

      download.download.progress = parseFloat((download.download.progress * 100).toFixed(1))
      download.download.progressUI = PROGRESS_PREFIX_DOWNLOAD.join('')

      setStateSpeedTestDownload(download)
      return
    }
    if (data.type === SpeedTestDataType.Upload) {
      const upload = data as ISpeedTestUpload
      const progressNumber = Math.floor(upload.upload.progress * (PROGRESS_AMOUNT - 1))

      for (let i = 0; i <= progressNumber; i++) {
        PROGRESS_PREFIX_UPLOAD[i] = PROGRESS_PREFIX_FILL
      }

      upload.upload.progress = parseFloat((upload.upload.progress * 100).toFixed(1))
      upload.upload.progressUI = PROGRESS_PREFIX_UPLOAD.join('')

      setStateSpeedTestUpload(upload)
      return
    }
    if (data.type === SpeedTestDataType.result) {
      setStateSpeedTestResult(data as ISpeedTestResult)
      return
    }
  }

  const watchList = [
    stateSpeedTestLog,
    stateSpeedTestStart,
    stateSpeedTestPing,
    stateSpeedTestDownload,
    stateSpeedTestUpload,
    stateSpeedTestResult
  ]
  //
  useEffect(() => {
    setStateSpeedTestMarkdownContent(readme(
      stateSpeedTestLog,
      stateSpeedTestStart,
      stateSpeedTestPing,
      stateSpeedTestDownload,
      stateSpeedTestUpload,
      stateSpeedTestResult
    ))
  }, watchList)

  function stderr(error: string) {
    console.log('stderr:', error)
  }


  // timer && clearInterval(timer)
  // timer = setInterval(() => {
  //   if (mockData.length === 0) {
  //     setStateIsSpeedTesting(false)
  //     timer && clearInterval(timer)
  //     return
  //   }
  //
  //   stdout(JSON.parse(mockData.shift()))
  // }, 100)

  function runSpeedTest() {
    if (isSpeedTestRuning) return
    isSpeedTestRuning = true
    const cwd = '/opt/homebrew/opt/speedtest/bin'
    const sp = spawn('speedtest',['-f', 'jsonl'], { cwd, shell: true })

    sp.stdout.on('data', data => stdout(JSON.parse(data.toString())))
    sp.stderr.on('data', data => stderr(data.toString()))
  }

  runSpeedTest()

  function DetailAction() {
    return <ActionPanel>
      <Action title="Create Report" icon={ Icon.Document }/>
      { false && <Action.OpenInBrowser url={"https://wwww.baidu.com"}/> }
      { false && <Action.CopyToClipboard title="Copy Results" content={'xxx'} icon={ Icon.Clipboard }/> }
      <Action.OpenInBrowser title="Help" url="https://wwww.a.com"/>
    </ActionPanel>
  }

  return <Detail
    actions={ <DetailAction/> }
    markdown={stateSpeedTestMarkdownContent}
    isLoading={ stateIsSpeedTesting }/>
}