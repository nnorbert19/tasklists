import Logout from '@/components/auth/Logout';
import Profile from '@/components/user/Profile';

export default async function page() {
  return (
    <div>
      <Profile />
      <Logout />
    </div>
  );
}
