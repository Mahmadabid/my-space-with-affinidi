import { UserContext } from '@/utils/Context';
import { faDownload, faEnvelope, faGlobe, faMapMarkerAlt, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import html2canvas from 'html2canvas';
import { useContext, useRef, useState } from 'react';

const Card = () => {

    const frontRef = useRef(null);
    const backRef = useRef(null);
    const [User, _] = useContext(UserContext);
    const [cardColor, setCardColor] = useState('#16c19b');
    const [bgColor, setBgColor] = useState('#0f172a');
    const [hdColor, setHdColor] = useState('#000000');
    const [pColor, setPColor] = useState('#FFFFFF');
    const [backCardColor, setBackCardColor] = useState('#16c19b');
    const [backBgColor, setBackBgColor] = useState('#0f172a');
    const [backHdColor, setBackHdColor] = useState('#FFFFFF');

    const handleFrontDownload = () => {
        const scale = 2;

        if (frontRef.current) {
            html2canvas(frontRef.current, { scale }).then((canvas) => {
                const link = document.createElement('a');
                link.href = canvas.toDataURL(`${User.user.givenName ? User.user.givenName : 'profileFront'}/png`);
                link.download = `${User.user.givenName ? User.user.givenName + 'Front' : 'profileFront'}.png`;
                link.click();
            });
        }
    };

    const handleBackDownload = () => {
        const scale = 2;

        if (backRef.current) {
            html2canvas(backRef.current, { scale }).then((canvas) => {
                const link = document.createElement('a');
                link.href = canvas.toDataURL(`${User.user.givenName ? User.user.givenName : 'profileBack'}/png`);
                link.download = `${User.user.givenName ? User.user.givenName + 'Back' : 'profileBack'}.png`;
                link.click();
            });
        }
    };

    return (
        <div className='flex flex-col justify-center items-center mb-2 mt-4'>
            <div ref={frontRef} className="w-[300px] h-[170px] mt-2 overflow-hidden relative" style={{ backgroundColor: bgColor }}>
                <div className="absolute w-16 h-16 right-2 bottom-3 overflow-hidden flex justify-center items-center bg-sky-100 rounded-full cursor-pointer">
                    {User.user.picture ? <img src={User.user.picture} /> :
                        <svg
                            className="w-12 h-12 text-[#207275] -mt-[2px]"
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
                    <div className='flex flex-row items-center'>
                        <FontAwesomeIcon icon={faUser} className="text-xl mr-2" style={{ color: hdColor }} />
                        <h2 className="text-xl font-bold break-all" style={{ color: hdColor }}>{User.user.givenName} {User.user.middleName} {User.user.familyName} {User.user.givenName && User.user.familyName && User.user.middleName ? null : 'User'}</h2>
                    </div>
                    <h2 className="text-lg font-semibold break-all ml-2" style={{ color: hdColor }}>{User.user.nickname ? User.user.nickname : 'pixel'}</h2>
                    <div className='flex flex-row items-center mt-10'>
                        <FontAwesomeIcon icon={faEnvelope} className="text-sm mr-2" style={{ color: pColor }} />
                        <p className="text-sm text-white break-all" style={{ color: pColor }}>{User.user.email ? User.user.email : 'user@email.com'}</p>
                    </div>
                    <div className='flex flex-row items-center'>
                        <FontAwesomeIcon icon={faPhone} className="text-sm mr-2" style={{ color: pColor }} />
                        <p className="text-sm text-white break-all" style={{ color: pColor }}>{User.user.phoneNumber ? User.user.phoneNumber : '00000000000'}</p>
                    </div>
                    <div className='flex flex-row items-center'>
                        <FontAwesomeIcon icon={faGlobe} className="text-sm mr-2" style={{ color: pColor }} />
                        <p className="text-sm text-white break-all" style={{ color: pColor }}>{User.user.country ? User.user.country : 'World'}</p>
                    </div>
                </div>
                <div className="absolute top-0 right-[80px] h-full w-full">
                    <div className={`h-full w-full border-[#00aaff] transform -skew-x-[30deg]`} style={{ backgroundColor: cardColor }}></div>
                </div>
            </div>
            <div className="mt-4">
                <p className="text-lg font-medium">Choose Colors:</p>
                <input type="color" value={cardColor} onChange={(e) => setCardColor(e.target.value)} className="mt-2 mx-1" />
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="mt-2 mx-1" />
                <input type="color" value={hdColor} onChange={(e) => setHdColor(e.target.value)} className="mt-2 mx-1" />
                <input type="color" value={pColor} onChange={(e) => setPColor(e.target.value)} className="mt-2 mx-1" />
            </div>
            <div className='flex flex-col justify-center items-center mt-2'>
                <p className="text-lg font-medium">Download Your Card</p>
                <button onClick={handleFrontDownload} className="my-2 flex text-white bg-blue-500 hover:bg-blue-700 p-2 font-medium rounded-md items-center">
                    <FontAwesomeIcon icon={faDownload} className="mr-2" />
                    Download Front
                </button>
            </div>
            <div ref={backRef} className="w-[300px] h-[170px] mt-2 overflow-hidden flex justify-center items-center relative" style={{ backgroundColor: backBgColor }}>
                <div className="px-2 pt-2 z-10 flex flex-row justify-center items-center">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xl mr-2" style={{ color: backHdColor }} />
                    <h2 className="text-xl font-bold break-all" style={{ color: backHdColor }}>{User.user.address} {User.user.address ? null : 'User Lives here'}</h2>
                </div>
                <div className="absolute top-0 right-[80px] h-full w-full">
                    <div className={`h-full w-full border-[#00aaff] transform -skew-x-[30deg]`} style={{ backgroundColor: backCardColor, zIndex: -30 }}></div>
                </div>
            </div>
            <div className="mt-4">
                <p className="text-lg font-medium">Choose Colors:</p>
                <input type="color" value={backCardColor} onChange={(e) => setBackCardColor(e.target.value)} className="mt-2 mx-1" />
                <input type="color" value={backBgColor} onChange={(e) => setBackBgColor(e.target.value)} className="mt-2 mx-1" />
                <input type="color" value={backHdColor} onChange={(e) => setBackHdColor(e.target.value)} className="mt-2 mx-1" />
            </div>
            <div className='flex flex-col justify-center items-center mt-2'>
                <p className="text-lg font-medium">Download Your Card</p>
                <button onClick={handleBackDownload} className="my-2 flex text-white bg-blue-500 hover:bg-blue-700 p-2 font-medium rounded-md items-center">
                    <FontAwesomeIcon icon={faDownload} className="mr-2" />
                    Download Back
                </button>
            </div>
        </div>
    );
};

export default Card;
