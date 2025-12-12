
function App(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const nyowaHandle = (): void => window.electron.ipcRenderer.send('nyowa')
  const readFile = (): void => window.electron.ipcRenderer.send('readFile')
  return (
    <>
      <button onClick={ipcHandle}>button</button>
      <button onClick={nyowaHandle}>nyowa</button>
      <button onClick={readFile}>readFile</button>
    </>
  )
}

export default App
