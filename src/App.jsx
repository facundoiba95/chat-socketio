import './App.css'
import Routes from './Routes/Routes';
import socket from './socket';

function App() {
  window.addEventListener('beforeunload' , () => {
    socket.disconnect('disconnect')
})
  return (
    <Routes/>
  )
}

export default App
