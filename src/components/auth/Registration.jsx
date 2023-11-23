'use client';
import { toast } from 'react-toastify';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRef, useState } from 'react';

function Registration() {
  const [loading, setLoading] = useState(false);
  const [passwordProblem, setPasswordProblem] = useState(false);
  const router = useRouter();
  const emailRef = useRef();
  const passwordRef = useRef();
  const password2Ref = useRef();

  function submitForm(e) {
    e.preventDefault();
    setLoading(true);
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const password2 = password2Ref.current.value;

    if (password === password2 && password.length >= 6) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          fetch('/api/login', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          }).then((response) => {
            if (response.status === 200) {
              router.push('/elso-lepesek');
            }
          });
        })

        .catch((err) => {
          console.log(err.code);
          switch (err.code) {
            case 'auth/email-already-in-use':
              toast.error('E-mail cím már használatban van!', {
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
            default:
              toast.error('Hiba lépett fel, kérjük próbálja meg újra!', {
                autoClose: 5000,
              });
              break;
          }
        });
      setLoading(false);
      setPasswordProblem(false);
    } else {
      if (password !== password2) {
        toast.error('A jelszavak nem egyeznek!', {
          autoClose: 5000,
        });
        setLoading(false);
        setPasswordProblem(true);
      } else {
        toast.error('A jelszónak legalább 6 karakterből kell állnia!', {
          autoClose: 5000,
        });
        setLoading(false);
        setPasswordProblem(true);
      }
    }
  }

  return (
    <div className='card w-96 bg-base-200 shadow-xl'>
      <div className='card-body gap-0'>
        <h2 className='card-title justify-center text-4xl mb-5'>
          Regisztráció
        </h2>

        <form onSubmit={submitForm}>
          <div className='form-control w-full max-w-xs'>
            <label className='label'>
              <span className='label-text'>E-mail cím *</span>
            </label>
            <input
              required
              ref={emailRef}
              type='email'
              name='email'
              placeholder='pelda@email.com'
              className='input input-bordered input-primary w-full max-w-xs'
            />
          </div>
          <div className='form-control w-full max-w-xs'>
            <label className='label'>
              <span className='label-text'>Jelszó *</span>
            </label>
            <input
              required
              ref={passwordRef}
              type='password'
              name='password'
              placeholder='jelszó'
              className={`input input-bordered ${
                passwordProblem ? 'input-error' : 'input-primary'
              }  w-full max-w-xs`}
            />
          </div>
          <div className='form-control w-full max-w-xs'>
            <label className='label'>
              <span className='label-text'>Jelszó megerősítése *</span>
            </label>
            <input
              required
              ref={password2Ref}
              type='password'
              name='password2'
              placeholder='jelszó'
              className={`input input-bordered ${
                passwordProblem ? 'input-error' : 'input-primary'
              }  w-full max-w-xs`}
            />
          </div>
          <div className=' m-0 mt-5 card-actions justify-center'>
            <button
              disabled={loading}
              type='submit'
              className='btn btn-primary'
            >
              Regisztráció
            </button>
          </div>
        </form>
        <div className='divider'></div>
        <div className='m-0 card-actions justify-center'>
          <Link href={'/bejelentkezes'}>
            <button className='btn btn-sm btn-secondary'>
              Már van fiókja?
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Registration;
