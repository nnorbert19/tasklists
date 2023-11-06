'use client';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import Avatar from './user/Avatar';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { getAuth, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

function Onboarding({ user }) {
  const auth = getAuth();
  const toastId = useRef(null);
  const fileUpload = useRef();
  const storage = getStorage();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [name, setName] = useState();
  const [photoURL, setPhotoUrl] = useState(
    user?.picture ? user?.picture : null
  );

  useEffect(() => {
    if (name?.length >= 1) {
      setDisabled(false);
    } else setDisabled(true);
  }, [name]);

  const fileCheck = (fileElement) => {
    if (!fileElement) {
      throw new Error(
        'Kérlek, válassz ki egy képet, amit fel szeretnél tölteni.'
      );
    }

    if (fileElement.files.length !== 1) {
      throw new Error(
        'Kérlek, válassz ki egy képet, amit fel szeretnél tölteni.'
      );
    }
    let file = fileElement.files[0];
    if (!/^image\//.test(file.type)) {
      throw new Error(
        'Kérlek, válassz ki egy képet, amit fel szeretnél tölteni.'
      );
    }
    return file;
  };

  function fileChanged() {
    setLoading(true);
    let fileElement = fileUpload.current;
    let file;
    try {
      file = fileCheck(fileElement);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      return;
    }

    const storageRef = ref(storage, `profilepictures/${user.email}/profilepic`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = snapshot.bytesTransferred / snapshot.totalBytes;
        console.log('Upload is ' + progress + '% done');

        if (toastId.current === null) {
          toastId.current = toast('Kép feltöltése folyamatban!', { progress });
        } else {
          toast.update(toastId.current, { progress });
        }
      },
      (error) => {
        switch (error.code) {
          case 'storage/canceled':
            toast.error('Kép feltöltése sikertelen!');
            break;
          case 'storage/unknown':
            toast.error('Kép feltöltése során hiba lépett fel!');
            break;
        }
        setLoading(false);
      },
      () => {
        toast.dismiss(toastId.current);
        toast.success('Kép feltöltése sikeres!');
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setPhotoUrl(downloadURL);
        });
        setLoading(false);
      }
    );
  }

  async function createUserInDb() {
    const docData = {
      email: user.email,
      scenes: [],
      displayName: name,
    };

    await setDoc(doc(db, 'users', user.email), docData);
  }

  async function submitForm(e) {
    e.preventDefault();

    const profile = await updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL,
    })
      .then(() => {
        return true;
      })
      .catch((error) => {
        toast.error(error.message);
      });

    const db = await createUserInDb()
      .then(() => {
        return true;
      })
      .catch((error) => toast.error(error.message));
    if (profile && db) {
      toast.success('Sikeres adat megadás');
      router.push('/');
    }
  }

  return (
    <div className='card w-96 max-w-5xl bg-base-100 shadow-xl'>
      <div className='card-body gap-10'>
        <form onSubmit={submitForm}>
          <div className='form-control w-full max-w-xs'>
            <label className='label'>
              <span className='label-text'>Profilkép feltöltése </span>
            </label>

            <div
              className={`flex column duration-500 ease-in-out ${
                photoURL && 'justify-evenly items-center'
              }`}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-8 h-8 duration-500 ease-in-out hover:cursor-pointer'
                label='képfeltöltés'
                onClick={() => fileUpload.current.click()}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5'
                />
              </svg>
              <div
                className={`w-24 ${
                  !photoURL && 'hidden'
                } duration-500 ease-in-out`}
              >
                <Avatar photoUrl={photoURL} />
              </div>
            </div>
            <input
              className='hidden'
              ref={fileUpload}
              onChange={() => fileChanged()}
              type='file'
              accept='image/*'
            />
          </div>
          <div className='form-control mt-5 w-full max-w-xs'>
            <label className='label'>
              <span className='label-text'>Név *</span>
            </label>
            <input
              required
              type='text'
              onChange={(e) => setName(e.target.value)}
              placeholder='Kovács Péter'
              className={`input input-bordered w-full max-w-xs`}
            />
          </div>
          <div className='m-0 mt-5 card-actions justify-center'>
            <button
              disabled={loading || disabled}
              type='submit'
              className='btn btn-primary'
            >
              Tovább
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Onboarding;
