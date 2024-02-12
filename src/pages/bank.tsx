import Form from "@/components/bank/Form";
import { countries } from "@/components/country/Countries";
import GetDate from "@/components/global/Date";
import { calculateAge } from "@/components/global/utils";
import Load from "@/components/utils/Load";
import { generateRandomId } from "@/components/utils/RandomId";
import { UserContext } from "@/utils/Context";
import { CountryContext } from "@/utils/CountryContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import stringSimilarity from 'string-similarity';

export interface BanktxProps {
    receiver: string;
    amount: string;
    id: string;
    date: string;
    owner: string;
}

const Bank = () => {

    const [User, _] = useContext(UserContext);
    const [country, setCountry] = useContext(CountryContext);
    const [switchCountry, setSwitchCountry] = useState(0);
    const [transactions, setTransactions] = useState<BanktxProps[]>([]);
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(0);
    const [receiver, setReceiver] = useState('');
    const [amountError, setAmountError] = useState<string | null>(null);
    const [receiverError, setReceiverError] = useState<string | null>(null);
    const [fetchData, setFetchData] = useState(false);
    const [account, setAccount] = useState(false);
    const [create, setCreate] = useState(false);
    const [missingFields, setMissingFields] = useState<string[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchCountry = localStorage.getItem('country');
        if (fetchCountry) {
            setSwitchCountry(2);
        } else {
            setSwitchCountry(1);
        }
    }, []);

    useEffect(() => {
        if (switchCountry !== 1) return;

        if (User.user.country) {
            const userCountryName = User.user.country;

            const matches = stringSimilarity.findBestMatch(
                userCountryName,
                countries.map((c) => c.name)
            );

            const bestMatch = matches.bestMatch;
            const closestCountry = countries.find((c) => c.name === bestMatch.target);

            if (closestCountry) {
                setCountry({
                    name: closestCountry.name,
                    currencySymbol: closestCountry.currencySymbol,
                    abbreviation: closestCountry.abbreviation,
                    currencyRate: closestCountry.currencyRate,
                });
            }
        } else {
            setCountry({
                name: "United States",
                currencySymbol: "$",
                abbreviation: "USD",
                currencyRate: 1,
            });
        }
    }, [User, switchCountry]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await fetch(`/api/bank?owner=${User.userId}`, {
                method: 'GET',
            });

            const data = await res.json();

            if (data.length > 0) {
                console.log(data)
                setAccount(true);
                setLoading(false);
            }
            else {
                setAccount(false);
                setLoading(false);
            }
        };

        fetchData();
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await fetch(`/api/banktx?owner=${User.userId}`, {
                method: 'GET',
            });

            const data = await res.json();

            if (data.length > 0) {
                setTransactions(data);
                setLoading(false);
            }
            else {
                setTransactions([]);
                setLoading(false);
            }
        };

        fetchData();
    }, [fetchData]);

    const handleCreateAccount = async () => {
        try {
            setLoading(true);
            const res = await fetch('api/bank', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ owner: User.userId }),
            });

            if (!res.ok) {
                throw new Error('Failed to create Account');
            }

            router.refresh();
        } catch (error) {
            console.error('Error creating Account:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleAddTransaction = async () => {
        setReceiverError(null);
        setAmountError(null);

        if (!receiver) {
            setReceiverError('Please enter a receiver');
        }

        if (amount <= 0) {
            setAmountError('Please enter amount more than 0');
        }

        if (receiver && amount > 0) {
            try {
                setLoading(true);
                const res = await fetch('api/banktx', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ receiver, amount, id: generateRandomId(User.userId), date: GetDate(), owner: User.userId }),
                });

                if (!res.ok) {
                    throw new Error('Failed to add transaction');
                }

                setAmount(0);
                setReceiver('');
                setFetchData(prev => !prev);
            } catch (error) {
                console.error('Error adding transaction:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        const missing = [];
        if (!User.user.givenName) missing.push('Givenname');
        if (!User.user.familyName) missing.push('Familyname');
        if (!User.user.email) missing.push('Email');
        if (!User.user.phoneNumber) missing.push('Phonenumber');
        if (!User.user.birthdate) missing.push('Birthdate');
        if (!User.user.gender) missing.push('Gender');
        if (!User.user.address) missing.push('Address');
        if (!User.user.country) missing.push('Country');
        if (!User.user.postalCode) missing.push('Postalcode');
        if (!User.user.picture) missing.push('Picture');
        if (!User.user.city) missing.push('City');
        if (!User.user.verified) missing.push('Liveness Check');

        setMissingFields(missing);
    }, [User]);

    const isAnyFieldMissing = missingFields.length > 0;

    return (
        <div className="flex flex-col justify-center items-center pt-6">

            {loading && (
                <div
                    className="fixed top-0 z-40 left-0 w-screen h-screen bg-gray-900 opacity-95 flex flex-col space-y-2 items-center justify-center"
                >
                    <Load className='w-9 h-9 fill-white' />
                </div>
            )}

            <h2 className='text-6xl xse:text-4xl font-bold mb-8 text-[#a152c0] italic'>Pixel Bank</h2>
            {calculateAge(User.user.birthdate ? User.user.birthdate : '') < 16 ?
                <div className="flex flex-col justify-center items-center">
                    <p className="font-medium text-lg text-red-500 my-2">Your age should be greater than 16 to access this feature.</p>
                    <Link href="/" className="bg-blue-500 p-1 hover:bg-blue-700 rounded text-white font-medium my-2">Go to home Page</Link>
                </div> : account ?
                    <div>
                        <div className="flex flex-row items-center justify-center">
                            {/* <button onClick={handleAddTransaction}>asdd</button> */}
                        </div>
                    </div> : create ? <Form handleCreateAccount={handleCreateAccount} /> :
                        <div className="flex flex-col justify-center items-center">
                            {isAnyFieldMissing ? <div>
                                <h4 className="font-medium text-[#ff0000] text-lg">Add these in Affinidi to be eligible for this feature</h4>
                                <ul className="flex justify-center items-center flex-col my-1 font-medium">
                                    {missingFields.map((fields, index) => <li className="text-[#00b7ff] flex flex-row items-center justify-center" key={index}><div className="w-2 h-2 rounded-full bg-[#10e4b6] mr-2"></div>{fields}</li>)}
                                </ul>
                            </div> : <h4 className="font-medium text-[#ff9100] text-lg">You are eligible to create your account</h4>}
                            <button disabled={isAnyFieldMissing} onClick={() => setCreate(true)} className={`bg-teal-500 hover:bg-teal-600 ${isAnyFieldMissing && 'hover:cursor-not-allowed bg-gray-500 hover:bg-slate-700'} my-2 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}>Create Account</button>
                        </div>
            }
        </div >
    )
}

export default Bank