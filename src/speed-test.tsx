import { useState, useEffect } from "react"
import { Detail, Environment } from "@raycast/api"
import readme from './detail-content'
import { spawn } from 'node:child_process'
import mockData from './log'
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
let timer: NodeJS.Timeout | null = null
// timer && clearInterval(timer)

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
    switch (data.type) {
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

  timer && clearInterval(timer)
  timer = setInterval(() => {
    if (mockData.length === 0) {
      timer && clearInterval(timer)
      return
    }

    // stdout(JSON.parse(mockData.shift()))

  }, 60)
  // const cwd = '/opt/homebrew/opt/speedtest/bin'
  // const sp = spawn('speedtest',['-f', 'jsonl'], { cwd, shell: true })
  // sp.stdout.on('data', data => stdout(data.toString()))
  // sp.stderr.on('data', data => stderr(data.toString()))

  return <Detail
    // command-icon.png
    markdown={stateSpeedTestMarkdownContent}
    isLoading={ stateIsSpeedTesting }/>
}