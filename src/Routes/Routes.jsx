import React from 'react';
import { Routes as RoutesDOM, Route, BrowserRouter } from 'react-router-dom';
import Login from '../components/molecules/Login/Login';
import Chat from '../components/molecules/Chat/Chat';


const Routes = () => {
  return (
    <BrowserRouter>
    <RoutesDOM>
        <Route path='/' element={<Login/>}/>
        <Route path='/chat' element={<Chat/>}/>
    </RoutesDOM>
    </BrowserRouter>
  )
}

export default Routes