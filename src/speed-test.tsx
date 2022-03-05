import { Detail } from "@raycast/api"
import { exec, spawn,execFile } from 'node:child_process'
import { useState } from "react"

/*
* TODO:
* 1. Copy result, and extension and author info
* 2. Recent Test History
* 3. s/I/c/C
* */

export default function() {
  console.log('run speed test')

  const [stateIsSpeedTesting, setStateIsSpeedTesting] = useState(true)

  function networkSpeedTest() {
    const sp = spawn('speedtest',['-f', 'jsonl'], { cwd:'/opt/homebrew/opt/speedtest/bin', shell: true})
    sp.stdin.on('data', data => console.log(data.toString(), 'stdin'))
    sp.stdout.on('data', data => console.log(data.toString(), 'stdout'))
    sp.stderr.on('data', data => console.log('err', data.toString()))
    return sp
  }
  networkSpeedTest()

  // exec('speedtest', { cwd: '/Users/Haojen/Desktop'}, (err, stdout, stderr) => {
  //   console.log(stdout, 'd')
  //   console.log(stderr, 'e1')
  //   console.log(err, 'err')
  // })

  return <Detail markdown={'nihao'} isLoading={ stateIsSpeedTesting }></Detail>
}