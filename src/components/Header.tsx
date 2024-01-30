import Link from 'next/link';
import { useState, useEffect, useRef, useContext } from 'react';
import Load from './utils/Load';
import ProfileDropdown from './log/ProfileDropdown';
import { UserContext } from '@/utils/Context';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [User, _] = useContext(UserContext);

  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setMenuOpen((prevMenuOpen) => !prevMenuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      closeMenu();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick as any);
    return () => {
      document.removeEventListener('click', handleOutsideClick as any);
    };
  }, []);

  return (
    <header className="bg-black p-4 z-50 text-white shadow-md relative flex items-center">
      {loggingOut && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-gray-950 opacity-95 flex flex-col space-y-2 items-center justify-center"
          style={{ zIndex: 1000 }}
        >
          <div className="text-white flex flex-row text-2xl font-bold">
            Logging Out &nbsp;<Load className='w-9 h-9 fill-white' />
          </div>
          <p className="text-orange-600 text-lg font-bold">It will take a few seconds</p>
        </div>
      )}
      {User.userId ? <ProfileDropdown setLoggingOut={setLoggingOut} email={User.user.email} />: <></>}
      <h1 className="mx-auto text-4xl xse:text-3xl font-bold">
        <Link href='/'>My Space</Link>
      </h1>
      <div>
        <button
          onClick={toggleMenu}
          className="inline-flex z-50 items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg hover:bg-gray-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          <svg className="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>
        <div
          ref={menuRef}
          className={`absolute right-0 mr-4 mt-2 z-50 w-48 bg-white shadow-md rounded-md ${menuOpen ? 'block' : 'hidden'}`}
        >
          <Link onClick={closeMenu} href="/">
            <h1 className="block hover:bg-blue-500 font-medium hover:rounded-md hover:text-white px-4 py-2 text-gray-800">Home</h1>
          </Link>
          <Link onClick={closeMenu} href="/todo">
            <h1 className="block hover:bg-blue-500 font-medium hover:rounded-md hover:text-white px-4 py-2 text-gray-800">Todo</h1>
          </Link>
          <Link onClick={closeMenu} href="/bookmarks">
            <h1 className="block hover:bg-blue-500 font-medium hover:rounded-md hover:text-white px-4 py-2 text-gray-800">Bookmarks</h1>
          </Link>
          <Link onClick={closeMenu} href="/expenses">
            <h1 className="block hover:bg-blue-500 font-medium hover:rounded-md hover:text-white px-4 py-2 text-gray-800">Expenses</h1>
          </Link>
        </div>
      </div>
    </header>
  )
};

export default Header;
