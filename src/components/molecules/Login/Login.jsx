import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../../../context/GlobalContext'
import socket from '../../../socket';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const { user, setUser } = useContext(GlobalContext);
    const [ colorGenerate, setColorGenerate ] = useState('');
    const date = `${new Date().getHours()}:${new Date().getMinutes()}`;

    const navigator = useNavigate();

    
    const generarNuevoColor = () => {
      let simbolos, color;
      simbolos = "0123456789ABCDEF";
      color = "#";
  
      for(var i = 0; i < 6; i++){
          color = color + simbolos[Math.floor(Math.random() * 16)];
      }

      setColorGenerate(color)
  }

  useEffect(() => {
    generarNuevoColor();
  }, [])

    const handleLogin = async (e) => {
        e.preventDefault();
        
        const newUser = {
            user,
            color: colorGenerate,
            id: socket.id,
            hour: date
        }
        socket.emit('login', newUser)
        navigator('/chat');
    }

  return (
    <form className='loginContainerStyle' onSubmit={handleLogin}>
        <input type="text" value={user} onChange={(e) => setUser(e.target.value)}/>
        <button>Ingresar</button>
    </form>
  )
}

export default Login