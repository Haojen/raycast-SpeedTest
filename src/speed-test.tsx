import { useEffect, useState } from "react"
import { spawn } from 'node:child_process'
import { Detail, ActionPanel, Action, Icon } from "@raycast/api"
import readme from "./detail-content"
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

let isSpeedTestRunning = true

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
      setStateSpeedTestDownload(data as ISpeedTestDownload)
      return
    }
    if (data.type === SpeedTestDataType.Upload) {
      setStateSpeedTestUpload(data as ISpeedTestUpload)
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

  function runSpeedTest() {
    if (isSpeedTestRunning) return
    isSpeedTestRunning = true
    const cwd = '/opt/homebrew/opt/speedtest/bin'
    const sp = spawn('speedtest',['-f', 'jsonl'], { cwd, shell: true })

    sp.stdout.on('data', data => stdout(JSON.parse(data.toString())))
    sp.stderr.on('data', data => stderr(data.toString()))
  }

  runSpeedTest()

  function DetailAction() {
    return <ActionPanel>
      { stateSpeedTestResult?.result.url && <Action.OpenInBrowser url={ stateSpeedTestResult?.result.url }/> }
      { stateSpeedTestResult?.result.url && <Action.CopyToClipboard title="Copy Results" content={'!!!xxx!!!'} icon={ Icon.Clipboard }/> }
      <Action.OpenInBrowser title="Help" url="https://github.com/haojen/raycast-speedtest"/>
    </ActionPanel>
  }

  return <Detail
    actions={ <DetailAction/> }
    markdown={stateSpeedTestMarkdownContent}
    isLoading={ stateIsSpeedTesting }/>
}