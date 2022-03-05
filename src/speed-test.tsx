import { useState } from "react"
import { Detail } from "@raycast/api"
import readme from './detail-content'
import { spawn } from 'node:child_process'
import {
  ISpeedLog,
  ISpeedTestBasic,
  ISpeedTestDownload,
  ISpeedTestPing, ISpeedTestResult,
  ISpeedTestStart, ISpeedTestUpload,
  SpeedTestDataType
} from "./types"

/*
* TODO:
* 1. Copy result, and extension and author info
* 2. Recent Test History
* */

export default function() {
  console.log('run speed test')

  const [stateIsSpeedTesting, setStateIsSpeedTesting] = useState(true)
  const [stateSpeedTestLog, setStateSpeedTestLog] = useState<ISpeedLog>()
  const [stateSpeedTestStart, setStateSpeedTestStart] = useState<ISpeedTestStart>()
  const [stateSpeedTestPing, setStateSpeedTestPing] = useState<ISpeedTestPing>()
  const [stateSpeedTestDownload, setStateSpeedTestDownload] = useState<ISpeedTestDownload>()
  const [stateSpeedTestUpload, setStateSpeedTestUpload] = useState<ISpeedTestUpload>()
  const [stateSpeedTestResult, setStateSpeedTestResult] = useState<ISpeedTestResult>()

  function stdout(data: ISpeedTestBasic){
    console.log('updating..', data)
    switch (data.type) {
      case SpeedTestDataType.log:
        setStateSpeedTestLog(data as ISpeedLog)
        break
      case SpeedTestDataType.testStart:
        setStateSpeedTestStart(data as ISpeedTestStart)
        break
      case SpeedTestDataType.Ping:
        setStateSpeedTestPing(data as ISpeedTestPing)
        break
      case SpeedTestDataType.Download:
        setStateSpeedTestDownload(data as ISpeedTestDownload)
        break
      case SpeedTestDataType.Upload:
        setStateSpeedTestUpload(data as ISpeedTestUpload)
        break
      case SpeedTestDataType.result:
        setStateSpeedTestResult(data as ISpeedTestResult)
        break
    }
  }

  function stderr(error: string) {
    console.log('err', error)
  }

  const cwd = '/opt/homebrew/opt/speedtest/bin'
  const sp = spawn('speedtest',['-f', 'jsonl'], { cwd, shell: true })
  sp.stdout.on('data', data => stdout(data.toString()))
  sp.stderr.on('data', data => stderr(data.toString()))

  // readme(
  //   stateSpeedTestLog,
  //   stateSpeedTestStart,
  //   stateSpeedTestPing,
  //   stateSpeedTestDownload,
  //   stateSpeedTestUpload,
  //   stateSpeedTestResult
  // )

  return <Detail
    markdown={ "123" + stateSpeedTestDownload?.download.bandwidth.toString()}
    isLoading={ stateIsSpeedTesting }/>
}