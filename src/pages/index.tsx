import { UserContext } from "@/utils/Context";
import { faBookmark, faIdCard, faMoneyBill, faMoneyBillTransfer } from "@fortawesome/free-solid-svg-icons";
import { faPencilSquare } from "@fortawesome/free-solid-svg-icons/faPencilSquare";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useContext } from "react";

const Home = () => {

  const [User, _] = useContext(UserContext);

  return (
    <div className="my-2 mx-2">
      <div className="mx-auto bg-sky-50 my-3 px-4 py-6 rounded-lg shadow-md max-w-lg">
        <h1 className="font-bold text-3xl text-blue-500 italic text-center mb-4">Welcome, {User.user.nickname ? User.user.nickname : User.user.givenName ? User.user.givenName : 'User'}</h1>
        <p className="mb-4">My Space offers you access to a variety of features all in one place. Whether you need to track expenses, manage tasks, or organize bookmarks, we've got you covered.</p>
        <p className="mb-4">But wait, there's more! My Space also includes a banking feature. You can send money to anyone and use your bank account to purchase items in <Link href="https://pixels-market.vercel.app/" target="_blank" className="text-blue-500 font-medium">Pixel Market</Link>.</p>
      </div>
      <div className="flex flex-wrap justify-center space-x-7 items-center">
        <div className="bg-teal-100 my-3 px-4 py-6 rounded-lg shadow-md min-w-64 max-w-96">
          <div className="flex flex-row justify-center items-center space-x-3 my-2">
            <FontAwesomeIcon icon={faMoneyBillTransfer} className="w-10 h-10" />
            <h1 className="font-bold text-3xl text-blue-500 italic text-center">Bank</h1>
          </div>
          <p className="mb-4">The Pixel Bank allows you to send money to your friends, family and other people. It also allows you to buy stuff directly from <Link href="https://pixels-market.vercel.app/" target="_blank" className="text-blue-500 font-medium">Pixel Market</Link>. You also get a signup bonus.</p>
          <div className="flex justify-center items-center">
            <Link href="/bank">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Go to Bank
              </button>
            </Link>
          </div>
        </div>
        <div className="bg-green-100 my-3 px-4 py-6 rounded-lg shadow-md min-w-64 max-w-96">
          <div className="flex flex-row justify-center items-center space-x-3 my-2">
            <FontAwesomeIcon icon={faIdCard} className="w-10 h-10" />
            <h1 className="font-bold text-3xl text-blue-500 italic text-center">Card Maker</h1>
          </div>
          <p className="mb-4">Create your business card directly from card maker. Data will be taken from your affinidi vault and added auomatically to save you time.</p>
          <div className="flex justify-center items-center">
            <Link href="/card">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Go to Card Maker
              </button>
            </Link>
          </div>
        </div>
        <div className="bg-purple-100 my-3 px-4 py-6 rounded-lg shadow-md min-w-64 max-w-96">
          <div className="flex flex-row justify-center items-center space-x-3 my-2">
            <FontAwesomeIcon icon={faPencilSquare} className="w-10 h-10" />
            <h1 className="font-bold text-3xl text-blue-500 italic text-center">Todo</h1>
          </div>
          <p className="mb-4">Stay organized and on top of your tasks with our intuitive Todo feature. Manage your to-do list effortlessly. Open them from other devices. Your data is safe with us</p>
          <div className="flex justify-center items-center">
            <Link href="/todo">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Go to Todo
              </button>
            </Link>
          </div>
        </div>
        <div className="bg-orange-100 my-3 px-4 py-6 rounded-lg shadow-md min-w-64 max-w-96">
          <div className="flex flex-row justify-center items-center space-x-3 my-2">
            <FontAwesomeIcon icon={faMoneyBill} className="w-10 h-10" />
            <h1 className="font-bold text-3xl text-blue-500 italic text-center">Expense Tracker</h1>
          </div>
          <p className="mb-4">Track your expenses and stay within budget using our handy Expense Tracker. Manage your finances with ease. Open them from other devices. Your data is safe with us</p>
          <div className="flex justify-center items-center">
            <Link href="/expense">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Go to Expense Tracker
              </button>
            </Link>
          </div>
        </div>
        <div className="bg-yellow-100 my-3 px-4 py-6 rounded-lg shadow-md min-w-64 max-w-96">
          <div className="flex flex-row justify-center items-center space-x-3 my-2">
            <FontAwesomeIcon icon={faBookmark} className="w-10 h-10" />
            <h1 className="font-bold text-3xl text-blue-500 italic text-center">Bookmark</h1>
          </div>
          <p className="mb-4">Organize your favorite websites and resources with our Bookmark feature. Never lose track of important links again. Open them from other devices. Your data is safe with us.</p>
          <div className="flex justify-center items-center">
            <Link href="/bookmark">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Go to Bookmarks
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;
