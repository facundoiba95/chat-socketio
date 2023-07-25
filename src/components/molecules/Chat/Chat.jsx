import React, { useContext, useEffect, useRef, useState } from 'react'
import { GlobalContext } from '../../../context/GlobalContext'
import socket from '../../../socket';
import ('./ChatStyles.css');

const Chat = () => {
    const { message, setMessage, listMessages, setListMessages, user, usersOnline, setUsersOnline} = useContext(GlobalContext);
    const chatListRef = useRef(null);
    const date = `${new Date().getHours()}:${new Date().getMinutes()}`;
    const [ typingUserMessage, setTypingUserMessage ] = useState('');
    /* el estado "listMessages" se setea dos veces, la primera vez para que 
      renderice en la pantalla de quien envia el mensaje
      y la segunda vez es para qeu renderice en la pantalla de quien recibe el mensaje */

    const handleMessage = (e) => {
        e.preventDefault();
        const newMessage = {
            user: 'Me',
            message,
            hour: date,
            id: socket.id
        }
        setListMessages([... listMessages, newMessage])
        socket.emit('message', newMessage);

        setMessage('');
    }

    const scrollToLastMessage = () => {
        if (chatListRef.current && chatListRef.current.lastChild) {
            // Hacemos que el último hijo (último mensaje) sea visible.
            chatListRef.current.lastChild.scrollIntoView({ behavior: 'smooth',block:'end' });
        }
    }

    
    const timedOutMessage = setTimeout(() => {
        setTypingUserMessage('')
    }, 3000)

    const typingMessage = (e) => {
        setMessage(e.target.value);
        socket.emit('typing');
    }
    
    useEffect(() => {
        const recivedMessage = ( data ) => {
            const newMessage = {
                user: data.user,
                message: data.message,
                hour: date,
                color: data.color,
                id: data.id
            }
            setListMessages([ ... listMessages, newMessage ])
        };

        socket.on('message', (data) => recivedMessage(data));

        scrollToLastMessage();
        return () => {
            socket.off('message', (data) => recivedMessage(data));
        }
    }, [ listMessages ])


    useEffect(() => {
        const recivedUsers = (data) => {
            setUsersOnline(data)
        }

        const typingMessageInChat = (data) => {
            setTypingUserMessage(data.message)

            if(typingMessage){
                clearTimeout(timedOutMessage)
            } else {
                setTypingUserMessage('')
            }
        }

        const userDisconnectMessage = (data) => {
            setListMessages([... listMessages, data])
        }

        const userLoginMessage = (data) => {
            setListMessages([ ... listMessages, data ])
        }
        
        socket.on('logged', (data) => recivedUsers(data));
        socket.on('typing', (data) => typingMessageInChat(data));
        socket.on('usersOnline', (data) => recivedUsers(data))
        socket.on('userDisconnect', (data) => userDisconnectMessage(data));
        socket.on('userLogin', (data) => userLoginMessage(data))
        return () => {
            socket.off('logged', (data) => recivedUsers(data));
            socket.off('usersOnline', (data) => recivedUsers(data));
            socket.off('typing', (data) => typingMessageInChat(data));
            socket.off('userDisconnect', (data) => userDisconnectMessage(data));
            socket.off('userLogin', (data) => userLoginMessage(data))
        }
    }, [ usersOnline ])


  return (
    <div className='containerChat'>
       <h2>Chat</h2>
       <ul className='listChat' ref={chatListRef}>
        {
            listMessages.map((msg, index) => {
                return (
                    <>
                    {
                        msg.messageDisconnect ?
                        <span style={{color:'crimson'}} className='notification'>
                            <p>{msg.messageDisconnect}</p>
                            <small>{msg.hour}</small>
                        </span>
                        : msg.messageLogin ?
                        <span style={{color:'yellowgreen'}} className='notification'>
                            <p>{msg.messageLogin}</p>
                            <small>{msg.hour}</small>
                        </span>
                        : <li key={index} className={`${msg.id == socket.id ? 'messageMe' : 'messageRecived'}`}>
                            <small style={{color:`${msg.color}`}}>{msg.user}</small>
                            <span className='messageContainer'>
                              <p>{msg.message}</p>
                            </span>
                            <p className='hour'>{msg.hour}</p>
                          </li>
                    }
                    </>
                )
            })
        }
       </ul>
       <form onSubmit={handleMessage}>
       <p className='typingMessage'>{typingUserMessage}</p>
         <input type="text" value={ message } onChange={(e) => typingMessage(e)}/>
         <button>Enviar</button>
       </form>
    </div>
  )
}

export default Chat