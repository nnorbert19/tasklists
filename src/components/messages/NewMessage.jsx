import { db } from '@/lib/firebase';
import { getUnixTime } from 'date-fns';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';

function NewMessage({ user, id }) {
  const messageRef = useRef();
  const [loading, setLoading] = useState(false);

  async function submitForm(e) {
    e.preventDefault();
    setLoading(true);
    const data = {
      messages: arrayUnion({
        message: messageRef.current.value,
        senderEmail: user.email,
        timestamp: getUnixTime(new Date()),
      }),
    };
    const messagesDocRef = doc(db, 'messages', id);

    try {
      await updateDoc(messagesDocRef, data);
      messageRef.current.value = '';
      toast.success('Üzenet elküldve!');
    } catch (error) {
      console.error(error.message);
      toast.error('Hiba történt!');
    }
    setLoading(false);
  }

  return (
    <div className='w-full h-32 mt-2'>
      <form
        className='flex flex-wrap align-baseline justify-center content-center'
        onSubmit={submitForm}
      >
        <textarea
          required
          type='text'
          placeholder='Üzenet'
          ref={messageRef}
          className='input input-bordered input-primary max-h-20 mx-3 w-full border-2 rounded'
        />
        <button disabled={loading} className='btn btn-primary mx-3 mt-2'>
          Küldés
        </button>
      </form>
    </div>
  );
}

export default NewMessage;
