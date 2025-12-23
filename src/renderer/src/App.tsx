
function App(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const nyowaHandle = (): void => window.electron.ipcRenderer.send('nyowa')
  const handleReadFile = async (): Promise<void> => {
    const data = await window.api.readFile()
    console.log(data)
  }
  return (
    <>
      <button onClick={ipcHandle}>button</button>
      <button onClick={nyowaHandle}>nyowa</button>
      <button onClick={handleReadFile}>readFile</button>
    </>
  )
}

export default App
