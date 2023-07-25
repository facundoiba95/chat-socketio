import io from 'socket.io-client';

const socket = io('https://vps-3471494-x.dattaweb.com/api/chat-socketio');

export default socket;