import { useCtx } from '@/context/Context';
import NewMessage from './NewMessage';
import Messages from './Messages';
import { useEffect, useRef } from 'react';

function MessagesHolder({ messagesData }) {
  const { userData } = useCtx();
  const messagesEndRef = useRef();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messagesData]);

  return (
    <div className='w-full h-screen p-10'>
      <div className='flex flex-col w-full h-full bg-base-100 rounded-lg p-5'>
        <div className='h-full border-primary border-solid border-4 rounded-lg m-4 p-5 overflow-auto'>
          {messagesData?.messages?.map((message) => (
            <Messages
              key={message.timestamp}
              message={message}
              sentByUser={message.senderEmail == userData.email}
              users={messagesData.users}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
        <NewMessage user={userData} id={messagesData.id} />
      </div>
    </div>
  );
}

export default MessagesHolder;
