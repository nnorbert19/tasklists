import { format, fromUnixTime } from 'date-fns';
import Avatar from '../user/Avatar';

function Messages({ message, sentByUser, users }) {
  const sender = users?.filter((user) => user.email == message.senderEmail);
  return (
    <div className={`chat ${sentByUser ? 'chat-end' : 'chat-start'}`}>
      <div className='chat-image avatar'>
        <div className='w-10 rounded-full'>
          <Avatar photoUrl={sender.length !== 0 ? sender[0].photoUrl : null} />
        </div>
      </div>
      <div className='chat-header font-medium'>
        {sender.length !== 0 ? sender[0].displayName : 'Törölt felhasználó'}
      </div>
      <div
        className={`chat-bubble  ${
          sentByUser ? 'chat-bubble-success' : 'chat-bubble-info'
        }`}
      >
        {message.message}
      </div>
      <div className='chat-footer opacity-50'>
        {format(fromUnixTime(message.timestamp), 'yyyy/MM/dd H:mm')}
      </div>
    </div>
  );
}

export default Messages;
