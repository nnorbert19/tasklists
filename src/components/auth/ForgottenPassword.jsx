'use client';

import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';

function ForgottenPassword() {
  const auth = getAuth();
  const emailRef = useRef();
  const [loading, setLoading] = useState(false);

  function submitForm(e) {
    e.preventDefault();
    setLoading(true);
    sendPasswordResetEmail(auth, emailRef.current.value)
      .then(() => {
        toast.success('E-mail elküldve, kövesse a benne lévő utasításokat!');
        setLoading(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setLoading(false);
        if (error.code == 'auth/invalid-email') {
          toast.error('E-mail cím nem található!');
        } else {
          toast.error('Hiba történt!');
        }
        console.error(errorCode);
        console.error(errorMessage);
      });
  }

  return (
    <div className='card w-96 bg-base-100 shadow-xl'>
      <div className='card-body gap-0'>
        <h2 className='card-title justify-center text-4xl mb-5'>
          Elfelejtett jelszó
        </h2>
        <form onSubmit={submitForm}>
          <div className='form-control w-full max-w-xs'>
            <label className='label'>
              <span className='label-text'>E-mail cím:</span>
            </label>
            <input
              required
              type='email'
              ref={emailRef}
              placeholder='pelda@email.com'
              className={`input input-bordered input-primary
             w-full max-w-xs`}
            />
          </div>
          <div className='m-0 mt-5 card-actions justify-center'>
            <button
              disabled={loading}
              type='submit'
              className='btn btn-primary'
            >
              E-mail küldése
            </button>
          </div>
        </form>
        <div className='divider' />
        <div className='flex justify-center mt-1 text-bg-info'>
          <Link href={'/bejelentkezes'} className='btn btn-sm btn-secondary'>
            Bejelentkezés
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgottenPassword;
