'use client';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { useCtx } from '@/context/Context';
import Avatar from './Avatar';
import { getAuth, updatePassword, updateProfile } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { arrayRemove, arrayUnion, doc, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';

function Profile() {
  const { userData, scenes } = useCtx();
  const [activeMenu, setActiveMenu] = useState('profilePic');
  const [displayName, setDisplayName] = useState(
    userData ? userData.displayName : ''
  );
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [disabled, setDisabled] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const toastId = useRef(null);
  const fileUpload = useRef();
  const storage = getStorage();

  useEffect(() => {
    setDisplayName(userData?.displayName);
  }, [userData]);

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
    setDisabled(true);
    let fileElement = fileUpload.current;
    let file;
    try {
      file = fileCheck(fileElement);
    } catch (error) {
      toast.error(error.message);
      return;
    }

    const storageRef = ref(
      storage,
      `profilepictures/${userData?.email}/profilepic`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = snapshot.bytesTransferred / snapshot.totalBytes;
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
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          try {
            const batch = writeBatch(db);
            const userDocRef = doc(db, 'users', userData.email);
            batch.update(userDocRef, {
              photoUrl: downloadURL,
            });
            scenes?.forEach((scene) => {
              const sceneDocRef = doc(db, 'scenes', scene.id);
              const messageDocRef = doc(db, 'messages', scene.id);

              batch.update(sceneDocRef, {
                users: arrayRemove({
                  email: userData.email,
                  displayName: userData.displayName,
                  photoUrl: userData.photoUrl,
                }),
              });
              batch.update(sceneDocRef, {
                users: arrayUnion({
                  email: userData.email,
                  displayName: userData.displayName,
                  photoUrl: downloadURL,
                }),
              });

              batch.update(messageDocRef, {
                users: arrayRemove({
                  email: userData.email,
                  displayName: userData.displayName,
                  photoUrl: userData.photoUrl,
                }),
              });
              batch.update(messageDocRef, {
                users: arrayUnion({
                  email: userData.email,
                  displayName: userData.displayName,
                  photoUrl: downloadURL,
                }),
              });
            });

            batch.update;
            updateProfile(auth.currentUser, {
              photoURL: downloadURL,
            }).catch((error) => {
              console.error(error.message);
            });
            await batch.commit();
            toast.dismiss(toastId.current);
            toast.success('Kép feltöltése sikeres!');
            setDisabled(false);
          } catch (error) {
            setDisabled(false);
            toast.error('Hiba történt!');

            console.error(error.message);
          }
        });
      }
    );
  }

  async function changeNameFn(e) {
    e.preventDefault();
    setDisabled(true);
    if (displayName == userData.displayName) return;
    try {
      const batch = writeBatch(db);
      const userDocRef = doc(db, 'users', userData.email);
      batch.update(userDocRef, {
        displayName: displayName,
      });
      scenes?.forEach((scene) => {
        const sceneDocRef = doc(db, 'scenes', scene.id);
        const messageDocRef = doc(db, 'messages', scene.id);

        batch.update(sceneDocRef, {
          users: arrayRemove({
            email: userData.email,
            displayName: userData.displayName,
            photoUrl: userData.photoUrl,
          }),
        });
        batch.update(sceneDocRef, {
          users: arrayUnion({
            email: userData.email,
            displayName: displayName,
            photoUrl: userData.photoUrl,
          }),
        });

        batch.update(messageDocRef, {
          users: arrayRemove({
            email: userData.email,
            displayName: userData.displayName,
            photoUrl: userData.photoUrl,
          }),
        });
        batch.update(messageDocRef, {
          users: arrayUnion({
            email: userData.email,
            displayName: displayName,
            photoUrl: userData.photoUrl,
          }),
        });
      });

      batch.update;
      await batch.commit();
      updateProfile(auth.currentUser, {
        displayName: displayName,
      }).catch((error) => {
        toast.error('Hiba történt!');
        console.error(error.message);
      });
      toast.success('Sikeres név módosítás!');
      setDisabled(false);
    } catch (error) {
      toast.error('Hiba történt!');
      setDisabled(false);

      console.error(error.message);
    }
  }

  function changePasswordFn(e) {
    e.preventDefault();
    if (password !== password2) {
      toast.error('A jelszavak nem egyeznek!');
      return;
    }
    if (password.length < 6) {
      toast.error('A jelszónak legalább 6 karakterből kell állnia!');
      return;
    }

    updatePassword(user, password)
      .then(() => {
        // Update successful.
        toast.success('Sikeres jelszó változtatás!');
      })
      .catch((error) => {
        toast.error('Hiba történt');
        console.error(error.message);
        // An error ocurred
        // ...
      });
  }

  const profilePicUpload = (
    <div className='flex flex-col justify-center items-center'>
      <h3 className='pb-2 text-xl font-medium'>Új profilkép feltöltése</h3>
      <div
        className={`flex w-full duration-500 ease-in-out  items-center ${
          userData?.photoUrl ? 'justify-evenly' : 'justify-center'
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
            !userData?.photoUrl && 'hidden'
          } duration-500 ease-in-out`}
        >
          <Avatar photoUrl={userData?.photoUrl} />
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
  );

  const changePassword = (
    <div className='flex flex-col justify-center items-center'>
      <h3 className='pb-2 text-xl font-medium'>Jelszó megváltoztatása</h3>
      <form onSubmit={changePasswordFn}>
        <div className='form-control w-full max-w-xs'>
          <label className='label'>
            <span className='label-text'>Új jelszó:</span>
          </label>
          <input
            required
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='input input-bordered input-primary mt-1 p-2 w-full border rounded'
          />
        </div>
        <div className='form-control w-full max-w-xs'>
          <label className='label'>
            <span className='label-text'>Új jelszó:</span>
          </label>
          <input
            required
            type='password'
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            className='input input-bordered input-primary mt-1 p-2 w-full border rounded'
          />
        </div>
        <div className='p-2 card-actions justify-center'>
          <button
            disabled={disabled}
            type='submit'
            className='btn btn-primary btn-xs'
          >
            Mentés
          </button>
        </div>
      </form>
    </div>
  );

  const changeName = (
    <div className='flex flex-col justify-center items-center'>
      <h3 className='pb-2 text-xl font-medium'>Név megváltoztatása</h3>
      <form onSubmit={changeNameFn}>
        <input
          required
          type='text'
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className='input input-bordered input-primary mt-1 p-2 w-full border rounded'
        />
        <div className='p-2 card-actions justify-center'>
          <button
            disabled={disabled}
            type='submit'
            className='btn btn-primary btn-xs'
          >
            Mentés
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <>
      <dialog id='profileEditModal' className='modal'>
        <div className='modal-box'>
          <div className='text-center pb-3'>
            <ul className='menu menu-horizontal gap-1 bg-base-200 rounded-box'>
              <li>
                <a
                  className={`${activeMenu == 'profilePic' && 'active'}`}
                  onClick={() => setActiveMenu('profilePic')}
                >
                  Profilkép
                </a>
              </li>
              <li>
                <a
                  className={`${activeMenu == 'password' && 'active'}`}
                  onClick={() => setActiveMenu('password')}
                >
                  Jelszó
                </a>
              </li>
              <li>
                <a
                  className={`${activeMenu == 'nameChange' && 'active'}`}
                  onClick={() => setActiveMenu('nameChange')}
                >
                  Név
                </a>
              </li>
            </ul>
          </div>
          {activeMenu == 'profilePic' && profilePicUpload}
          {activeMenu == 'password' && changePassword}
          {activeMenu == 'nameChange' && changeName}
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
      <div className='bg-base-100 max-w-lg p-4 rounded-xl'>
        <Avatar photoUrl={userData?.photoUrl} styling={'w-16 h-16 mx-auto'} />
        <h1 className='text-2xl text-center font-bold mb-2'>
          {userData?.displayName}
        </h1>
        <p className='text-center mb-2'>{userData?.email}</p>

        <div className='flex justify-center space-x-4 '>
          <a
            href='#'
            className='btn btn-primary px-4 py-2 rounded-full transition duration-300'
            onClick={() =>
              document.getElementById('profileEditModal').showModal()
            }
          >
            Profil szerkesztése
          </a>
        </div>
      </div>
    </>
  );
}

export default Profile;
