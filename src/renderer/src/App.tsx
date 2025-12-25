import { useState } from 'react'
import type { Parsed } from '../../types'
import LogMonitor from './components/LogMonitor'

function App(): React.JSX.Element {
  const [logs, setLogs] = useState<Parsed[]>([]);
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const nyowaHandle = (): void => window.electron.ipcRenderer.send('nyowa')
  const handleReadFile = async (): Promise<void> => {
    const data = await window.api.readFile()
    setLogs(data)
  }

  const buttonStyle = 'border rounded-md gap-2 p-2 m-1 text-zinc-800'
  return (
    <>
      <div className='gap-2 m-4'>
        <button onClick={ipcHandle} className={buttonStyle}>button</button>
        <button onClick={nyowaHandle} className={buttonStyle}>nyowa</button>
        <button onClick={handleReadFile} className={buttonStyle}>readFile</button>
      </div>
      <div style={{ textAlign: 'center' }}>
        <h2>Logs ({logs.length})</h2>
        <pre style={{ textAlign: 'left', maxHeight: '500px', overflow: 'auto' }}>
          {JSON.stringify(logs, null, 2)}
        </pre>
      </div>
      {/* 仮実装: LogMonitor */}
      <LogMonitor logs={logs} />
    </>
  )
}

export default App
