'use client';
import Google from '@/components/auth/Google';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [passwordProblem, setPasswordProblem] = useState(false);
  const [emailProblem, setEmailProblem] = useState(false);

  function submitForm(e) {
    e.preventDefault();
    setLoading(true);
    setPasswordProblem(false);
    setEmailProblem(false);
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        fetch('/api/login', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${userCredential.user.accessToken}`,
          },
        }).then((response) => {
          if (response.status === 200) {
            const post = { email: email };
            fetch('api/checkUserInDb', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(post),
            })
              .then((response) => response.json())
              .then((data) => {
                if (data?.userHasData === true) {
                  router.push('/kezdolap');
                } else router.push('/elso-lepesek');
              });
          }
        });
      })
      .catch((err) => {
        setLoading(false);
        switch (err.code) {
          case 'auth/wrong-password':
            toast.error('Hibás jelszó!', {
              autoClose: 5000,
            });
            setPasswordProblem(true);
            break;
          case 'auth/invalid-email':
            toast.error('Hibás e-mail!', {
              autoClose: 5000,
            });
            setEmailProblem(true);
            break;

          case 'auth/user-not-found':
            toast.error('Felhasználó nem található!', {
              autoClose: 5000,
            });
            break;
          default:
            toast.error('Hiba lépett fel, kérjük próbálja meg újra!', {
              autoClose: 5000,
            });
            break;
        }
      });
  }

  return (
    <div className='card w-96 bg-base-100 shadow-xl'>
      <div className='card-body gap-0'>
        <h2 className='card-title justify-center text-4xl mb-5'>
          Bejelentkezés
        </h2>

        <Google setLoading={setLoading} />
        <div className='flex flex-col w-full border-opacity-50'>
          <div className='divider'>Vagy</div>
        </div>

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
              className={`input input-bordered ${
                emailProblem ? 'input-error' : 'input-primary'
              }  w-full max-w-xs`}
            />
          </div>
          <div className='form-control w-full max-w-xs'>
            <label className='label'>
              <span className='label-text'>Jelszó:</span>
            </label>
            <input
              required
              ref={passwordRef}
              type='password'
              placeholder='jelszó'
              className={`input input-bordered ${
                passwordProblem ? 'input-error' : 'input-primary'
              }  w-full max-w-xs`}
            />
          </div>
          <div className='m-0 mt-5 card-actions justify-center'>
            <button
              disabled={loading}
              type='submit'
              className='btn btn-primary'
            >
              Bejelentkezés
            </button>
          </div>
        </form>

        <div className='flex justify-center mt-1 text-bg-info'>
          <Link href={'/elfelejtett-jelszo'} className=' text-blue-600'>
            Elfelejtette a jelszavát?
          </Link>
        </div>

        <div className='divider'></div>

        <div className='m-0 card-actions justify-center'>
          <Link href={'/regisztracio'}>
            <button disabled={loading} className='btn btn-sm btn-secondary'>
              Új fiók létrehozása
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
