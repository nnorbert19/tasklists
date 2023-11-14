import { useEffect } from 'react';
import { redirect } from 'next/navigation';

function SceneNotFound() {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      redirect('/kezdolap');
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, []);

  return <div>Nem létezik ilyen színtér, vagy nem vagy tagja</div>;
}

export default SceneNotFound;
