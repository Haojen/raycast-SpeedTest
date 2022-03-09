import { useEffect, useState } from "react"
import { spawn } from "node:child_process"
import { Action, ActionPanel, Detail, Toast, showHUD } from "@raycast/api"
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

let isSpeedTestRunning = false

export default function() {
  const [stateIsSpeedTesting, setStateIsSpeedTesting] = useState(false)
  const [stateSpeedTestStart, setStateSpeedTestStart] = useState<ISpeedTestStart>()
  const [stateSpeedTestPing, setStateSpeedTestPing] = useState<ISpeedTestPing>()
  const [stateSpeedTestDownload, setStateSpeedTestDownload] = useState<ISpeedTestDownload>()
  const [stateSpeedTestUpload, setStateSpeedTestUpload] = useState<ISpeedTestUpload>()
  const [stateSpeedTestResult, setStateSpeedTestResult] = useState<ISpeedTestResult>()

  const [stateSpeedTestMarkdownContent, setStateSpeedTestMarkdownContent] = useState<string>('')

  function stdout(data: ISpeedTestBasic){
    const updateDataMap = {
      [SpeedTestDataType.testStart]() {
        setStateSpeedTestStart(data as ISpeedTestStart)
      },
      [SpeedTestDataType.Ping]() {
        setStateSpeedTestPing(data as ISpeedTestPing)
      },
      [SpeedTestDataType.Download]() {
        setStateSpeedTestDownload(data as ISpeedTestDownload)
      },
      [SpeedTestDataType.Upload]() {
        setStateSpeedTestUpload(data as ISpeedTestUpload)
      },
      [SpeedTestDataType.result]() {
        setStateSpeedTestResult(data as ISpeedTestResult)
      }
    }

    updateDataMap[data.type]()
  }

  const watchList = [
    stateSpeedTestStart,
    stateSpeedTestPing,
    stateSpeedTestDownload,
    stateSpeedTestUpload,
    stateSpeedTestResult
  ]
  //
  useEffect(() => {
    setStateSpeedTestMarkdownContent(readme(
      stateSpeedTestStart,
      stateSpeedTestPing,
      stateSpeedTestDownload,
      stateSpeedTestUpload,
      stateSpeedTestResult
    ))

    if (stateSpeedTestResult?.result.id) {
      setStateIsSpeedTesting(false)
      new Toast({
        title: 'Speed Test',
        message: 'Test Finished.',
        style: Toast.Style.Success
      }).show()
    }
  }, watchList)

  function stderr(error: ISpeedLog) {
    // Error: [0] Timeout occurred in connect. code [0] is normal can ignore it
    if (error.message.indexOf('[0]') != -1) return

    new Toast({
      title: 'Error',
      message: 'Please check you network connection.',
      style: Toast.Style.Failure
    }).show()
  }

  function runSpeedTest() {
    if (isSpeedTestRunning) return
    isSpeedTestRunning = true

    setStateIsSpeedTesting(true)
    const cwd = '/opt/homebrew/opt/speedtest/bin'
    const sp = spawn('speedtest',['-f', 'jsonl'], { cwd, shell: true })

    sp.stdout.on('data', data => stdout(JSON.parse(data.toString())))
    sp.stderr.on('data', data => {
      try {
        stderr(JSON.parse(data.toString()))
      }
      catch (err) {
        console.log('Not JSON Format Error')
      }
    })
  }

  runSpeedTest()

  function DetailAction() {
    return <ActionPanel>
      {
        stateSpeedTestResult?.result.url &&
        <Action.OpenInBrowser title="Result Details" url={ stateSpeedTestResult?.result.url }/>
      }
      <Action.OpenInBrowser title="Help" url="https://github.com/haojen/raycast-speedtest"/>
    </ActionPanel>
  }

  return <Detail
    actions={ <DetailAction/> }
    markdown={stateSpeedTestMarkdownContent}
    isLoading={ stateIsSpeedTesting }/>
}