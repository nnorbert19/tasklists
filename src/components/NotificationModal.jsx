/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useCtx } from '@/context/Context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function NotificationModal() {
  const router = useRouter();
  const { notifications, deleteNotification, scenes } = useCtx();
  const [uniqueNotifications, setUniqueNotifications] = useState([]);

  function setNotificationSceneName() {
    const uniqueById = new Map(notifications.map((obj) => [obj.id, obj]));
    const uniqueNotifications = [...uniqueById.values()];

    const scenesMap = new Map(scenes?.map((scene) => [scene.id, scene.name]));

    const notificationsWithSceneNames = uniqueNotifications.map(
      (notification) => {
        const sceneName = scenesMap.get(notification.sceneId);
        return { ...notification, sceneName };
      }
    );
    setUniqueNotifications(notificationsWithSceneNames);
  }

  useEffect(() => {
    setNotificationSceneName();
  }, [notifications]);

  function RenderNotification() {
    return uniqueNotifications.map((notification) => (
      <div
        className='card w-50 bg-base-100 border shadow-xl m-2 duration-200 hover:scale-105'
        key={notification.id}
      >
        <div className='card-body flex-row p-4'>
          <div
            className='hover:cursor-pointer'
            onClick={() => {
              document.getElementById('notiModal').close();
              router.push(
                notification.type == 'historyChange'
                  ? `/szinterek/${notification.sceneId}`
                  : `/szinterek/${notification.sceneId}/beszelgetes`
              );
            }}
          >
            {notification.type == 'historyChange' ? (
              <p>
                A(z){' '}
                <i>{notification.sceneName} nevű színtéren változás történt.</i>
              </p>
            ) : (
              <p>
                Új üzenet érkezett a(z){' '}
                <i>{notification.sceneName} nevű színtérre.</i>
              </p>
            )}
          </div>
          <div className='card-actions justify-end items-center duration-200 hover:cursor-pointer hover:scale-110'>
            <svg
              onClick={() => deleteNotification(notification.id)}
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-6 h-6 '
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
              />
            </svg>
          </div>
        </div>
      </div>
    ));
  }

  return (
    <dialog id='notiModal' className='modal'>
      <div className='modal-box'>
        <form method='dialog'>
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
            ✕
          </button>
        </form>
        <h3 className='font-bold text-lg'>Értesítések</h3>
        <RenderNotification />
      </div>
      <form method='dialog' className='modal-backdrop'>
        <button>Bezárás</button>
      </form>
    </dialog>
  );
}

export default NotificationModal;
