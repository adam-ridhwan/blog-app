import Link from 'next/link';

const AuthLinks = () => {
  //temporary
  const status = 'unauthenticated';
  return (
    <>
      {status === 'unauthenticated' ? (
        <>
          <Link href='/login'>Login</Link>
        </>
      ) : (
        <>
          <Link href='/logout'>Logout</Link>
        </>
      )}
    </>
  );
};

export default AuthLinks;
