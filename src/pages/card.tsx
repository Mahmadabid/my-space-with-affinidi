import { UserContext } from '@/utils/Context';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import html2canvas from 'html2canvas';
import { useContext, useRef } from 'react';

const Card = () => {

    const cardRef = useRef(null);
    const [User, _] = useContext(UserContext);

    const handleDownload = () => {
        const scale = 2;

        if (cardRef.current) {
            html2canvas(cardRef.current, { scale }).then((canvas) => {
                const link = document.createElement('a');
                link.href = canvas.toDataURL(`${User.user.givenName ? User.user.givenName : 'profile'}/png`);
                link.download = `${User.user.givenName ? User.user.givenName : 'profile'}.png`;
                link.click();
            });
        }
    };

    return (
        <div className='flex flex-col justify-center items-center mb-2 mt-4'>
            <div ref={cardRef} className="w-[300px] h-[170px] mt-2 overflow-hidden relative bg-slate-900">
                <div className="absolute w-16 h-16 right-2 bottom-3 overflow-hidden bg-sky-100 rounded-full cursor-pointer">
                    {User.user.picture ? <img src={User.user.picture} /> :
                        <svg
                            className="absolute w-12 h-12 text-[#207275] -left-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"
                            ></path>
                        </svg>}
                </div>
                <div className="px-2 pt-2 relative z-10">
                    <h2 className="text-xl font-bold break-all">{User.user.givenName} {User.user.middleName} {User.user.familyName} {User.user.givenName && User.user.familyName && User.user.middleName ? null : 'User'}</h2>
                    <h2 className="text-lg font-semibold break-all">{User.user.nickname ? User.user.nickname : 'pixel'}</h2>
                    <p className="text-sm text-gray-600 break-all mt-10">{User.user.email ? User.user.email : 'user@email.com'}</p>
                    <p className="text-sm text-gray-600 break-all">{User.user.phoneNumber ? User.user.phoneNumber : '00000000000'}</p>
                    <p className="text-sm text-gray-600 break-all">{User.user.country ? User.user.country : 'World'}</p>
                </div>
                <div className="absolute top-0 right-[80px] h-full w-full">
                    <div className="h-full w-full bg-[#16c19b] border-[#00aaff] transform -skew-x-[30deg]"></div>
                </div>
            </div>

            <div className='flex flex-col justify-center items-center mt-2'>
                <p className="text-lg font-medium">Download Your Card</p>
                <button onClick={handleDownload} className="my-2 flex text-white bg-blue-500 hover:bg-blue-700 p-2 font-medium rounded-md items-center">
                    <FontAwesomeIcon icon={faDownload} className="mr-2" />
                    Download
                </button>
            </div>
        </div>
    );
};

export default Card;
