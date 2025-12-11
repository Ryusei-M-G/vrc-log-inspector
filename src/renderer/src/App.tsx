
function App(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const nyowaHandle = (): void => window.electron.ipcRenderer.send('nyowa')

  return (
    <>
      <button onClick={ipcHandle}>button</button>
      <button onClick={nyowaHandle}>nyowa</button>
    </>
  )
}

export default App
