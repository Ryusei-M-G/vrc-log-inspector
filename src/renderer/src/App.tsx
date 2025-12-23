import { useState } from 'react'
import type { Parsed } from '../../types'

function App(): React.JSX.Element {
  const [logs, setLogs] = useState<Parsed[]>([]);
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const nyowaHandle = (): void => window.electron.ipcRenderer.send('nyowa')
  const handleReadFile = async (): Promise<void> => {
    const data = await window.api.readFile()
    setLogs(data)
    console.log('Fetched data:', data)
    console.log('Logs state:', logs)
  }
  return (
    <>
      <button onClick={ipcHandle}>button</button>
      <button onClick={nyowaHandle}>nyowa</button>
      <button onClick={handleReadFile}>readFile</button>
      <div style={{ textAlign: 'center' }}>
        <h2>Logs ({logs.length})</h2>
        <pre style={{ textAlign: 'left', maxHeight: '500px', overflow: 'auto' }}>
          {JSON.stringify(logs, null, 2)}
        </pre>
      </div>
    </>
  )
}

export default App
