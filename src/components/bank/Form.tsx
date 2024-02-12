import { UserContext } from "@/utils/Context";
import { faUser, faEnvelope, faPhone, faMapMarkerAlt, faMapMarkedAlt, faCity, faGlobe, faCalendar, faVenusMars, faCertificate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";

interface FormProps {
    handleCreateAccount: () => void;
}

const Form: React.FC<FormProps> = ({ handleCreateAccount }) => {

    const [User, _] = useContext(UserContext);

    return (
        <div className="break-all min-w-64 mx-2 mb-2">
            <div
                className="flex justify-center items-center"
            >
                <img src={User.user.picture} alt="Profile Picture" className="w-32 h-32 rounded-full" />
            </div>
            <label htmlFor="firstName" className="mt-4 block mb-2 font-medium">
                <div className="flex flex-row items-center"><FontAwesomeIcon icon={faUser} className="mr-1" />
                    First Name <div className='relative ml-1'>
                        <FontAwesomeIcon
                            icon={faCertificate}
                            className='text-2xl text-[#06f]'
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="absolute top-[47%] left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                            width="12"
                            height="12"
                            fill="#fff"
                            stroke="#fff"
                            strokeWidth="3"
                        >
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                    </div>
                </div>
            </label>
            <div
                id="firstName"
                className="w-full py-2 px-3 mb-4 border rounded bg-slate-200"
            >{User.user.givenName}</div>
            {User.user.middleName && <><label htmlFor="middleName" className="block mb-2 font-medium">
                <FontAwesomeIcon icon={faUser} className="mr-1" />
                Middle Name
            </label>
                <div
                    id="middleName"
                    className="w-full py-2 px-3 mb-4 border rounded bg-slate-200"
                >{User.user.middleName}</div></>}
            <label htmlFor="lastName" className="block mb-2 font-medium">
                <FontAwesomeIcon icon={faUser} className="mr-1" />
                Last Name
            </label>
            <div
                id="lastName"
                className="w-full py-2 px-3 mb-4 border rounded bg-slate-200"
            >{User.user.familyName}</div>
            <label htmlFor="email" className="block mb-2 font-medium">
                <FontAwesomeIcon icon={faEnvelope} className="mr-1" />
                Email
            </label>
            <div
                id="email"
                className="w-full py-2 px-3 mb-4 border rounded bg-slate-200"
            >{User.user.email}</div>
            <label htmlFor="phone" className="block mb-2 font-medium">
                <FontAwesomeIcon icon={faPhone} className="mr-1" />
                Phone Number
            </label>
            <div
                id="phone"
                className="w-full py-2 px-3 mb-4 border rounded bg-slate-200"
            >{User.user.phoneNumber}</div>
            <label htmlFor="gender" className="block mb-2 font-medium">
                <FontAwesomeIcon icon={faVenusMars} className="mr-1" />
                Gender
            </label>
            <div
                id="gender"
                className="w-full py-2 px-3 mb-4 border rounded bg-slate-200"
            >{User.user.gender}</div>
            <label htmlFor="birthdate" className="block mb-2 font-medium">
                <FontAwesomeIcon icon={faCalendar} className="mr-1" />
                Birthdate
            </label>
            <div
                id="birthdate"
                className="w-full py-2 px-3 mb-4 border rounded bg-slate-200"
            >{User.user.birthdate}</div>
            <label htmlFor="address" className="block mb-2 font-medium">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                Address
            </label>
            <div
                id="address"
                className="w-full py-2 px-3 mb-4 border rounded bg-slate-200"
            >{User.user.address}</div>
            <label htmlFor="postalCode" className="block mb-2 font-medium">
                <FontAwesomeIcon icon={faMapMarkedAlt} className="mr-1" />
                Postal Code
            </label>
            <div
                id="postalCode"
                className="w-full py-2 px-3 mb-4 border rounded bg-slate-200"
            >{User.user.postalCode}</div>
            <label htmlFor="city" className="block mb-2 font-medium">
                <FontAwesomeIcon icon={faCity} className="mr-1" />
                City
            </label>
            <div
                id="city"
                className="w-full py-2 px-3 mb-4 border rounded bg-slate-200"
            >{User.user.city}</div>
            <label htmlFor="country" className="block mb-2 font-medium">
                <FontAwesomeIcon icon={faGlobe} className="mr-1" />
                Country
            </label>
            <div
                id="country"
                className="w-full py-2 px-3 mb-2 border rounded bg-slate-200"
            >{User.user.country}</div>

            <div className="flex justify-center my-4 items-center">
                <button
                    className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={handleCreateAccount}
                >
                    Create Account
                </button>
            </div>
        </div>
    )
}

export default Form