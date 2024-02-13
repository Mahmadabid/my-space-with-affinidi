import Form from "@/components/bank/Form";
import GetDate from "@/components/global/Date";
import { calculateAge, convertedPrice, reConvertedPrice } from "@/components/global/utils";
import Load from "@/components/utils/Load";
import { generateRandomId } from "@/components/utils/RandomId";
import { UserContext } from "@/utils/Context";
import { CountryContext } from "@/utils/CountryContext";
import { faCopy, faGifts } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

export interface BankProps {
    receiver: string;
    amount: number;
    id: string;
    date: string;
    owner: string;
}

const Bank = () => {

    const [User, _] = useContext(UserContext);
    const [country] = useContext(CountryContext);
    const [transactions, setTransactions] = useState<BankProps[]>([]);
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(0);
    const [receiver, setReceiver] = useState('');
    const [amountError, setAmountError] = useState<string | null>(null);
    const [receiverError, setReceiverError] = useState<string | null>(null);
    const [fetchData, setFetchData] = useState(false);
    const [create, setCreate] = useState(false);
    const [copied, setCopied] = useState(false);
    const [missingFields, setMissingFields] = useState<string[]>([]);

    useEffect(() => {
        if (amount > 0) {
            setAmountError('');
        }
    }, [amount])

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await fetch(`/api/bank?owner=${User.userId}`, {
                method: 'GET',
            });

            const data = await res.json();

            if (data.length > 0) {
                const formattedData = data.map((item: { amount: string; }) => ({
                    ...item,
                    amount: parseFloat(item.amount),
                }));

                setTransactions(formattedData);
                setLoading(false);
            }
            else {
                setTransactions([]);
                setLoading(false);
            }
        };

        fetchData();
    }, [fetchData]);

    const calculateBalance = () => {
        if (transactions.length === 0) {
            return 0;
        } else {
            const balance = transactions.reduce((total, transaction) => (transaction.receiver === User.userId ? total + transaction.amount : total - transaction.amount), 0);
            return convertedPrice(balance, country.currencyRate);
        }
    };

    const handleSend = async (bank?: string) => {
        const balance = calculateBalance();

        setReceiverError(null);
        setAmountError(null);

        if (!receiver) {
            setReceiverError('Please enter a receiver');
        }

        if (amount <= 0) {
            setAmountError('Please enter amount more than 0');
        }

        if (balance < amount) {
            setAmountError('You dont have enough balance')
        }

        if (receiver && amount > 0 && balance >= amount || bank) {
            try {
                setLoading(true);
                const res = await fetch('api/bank', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ receiver: bank ? User.userId : receiver, amount: bank ? 100 : reConvertedPrice(amount, country.currencyRate), id: generateRandomId(User.userId), date: GetDate(), owner: bank || User.userId }),
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

    const copyUserId = () => {
        navigator.clipboard.writeText(User.userId);

        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 5000);
    };

    return (
        <div className="flex flex-col justify-center items-center pt-6">

            {loading && (
                <div
                    className="fixed top-0 z-40 left-0 w-screen h-screen bg-gray-700 opacity-70 flex flex-col space-y-2 items-center justify-center"
                >
                    <Load className='w-9 h-9 fill-white' />
                </div>
            )}

            <h2 className='text-6xl xse:text-4xl font-bold mb-8 text-[#b26cce] italic'>Pixel Bank</h2>
            {calculateAge(User.user.birthdate ? User.user.birthdate : '') < 16 ?
                <div className="flex flex-col justify-center items-center">
                    <p className="font-medium text-lg text-red-500 my-2">Your age should be greater than 16 to access this feature.</p>
                    <Link href="/" className="bg-blue-500 p-1 hover:bg-blue-700 rounded text-white font-medium my-2">Go to home Page</Link>
                </div> : transactions.length > 0 ?
                    <div className="mx-1">
                        <div>
                            <h2 className='font-medium my-1 text-lg'>Your Account:</h2>
                            <div
                                className="w-full flex flex-row items-center py-2 px-3 mb-4 border rounded bg-slate-100"
                            ><p className="break-all">{User.userId}</p>
                                <button
                                    className="ml-3 bg-blue-500 text-white px-3 hover:bg-blue-700 py-1 rounded"
                                    onClick={copyUserId}
                                >
                                    <FontAwesomeIcon icon={faCopy} />
                                </button>{copied && <p className="text-green-500 font-medium mx-1">Copied</p>}
                            </div>
                        </div>
                        <div>
                            <h2 className='font-medium my-1 text-lg'>Your Balance:</h2>
                            <div
                                className="w-full flex flex-row items-center py-2 px-3 mb-4 border rounded bg-slate-100"
                            ><p className="break-all"><span className="mr-1 font-medium text-[#03c9c2] text-lg">{country.currencySymbol}</span>{calculateBalance()}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 my-3 md:space-x-8">
                            <div className="col-span-1 mx-2">
                                <h2 className="text-5xl font-bold text-center italic text-[#00e1af]">Send</h2>
                                <div className="pt-4 mb-4">
                                    <h2 className='font-medium my-1 text-lg'>Amount:</h2>
                                    <div className="flex flex-row items-center">
                                        <span className="mr-2 font-medium text-[#03c9c2] text-lg">{country.currencySymbol}</span>
                                        <input onChange={(e) => setAmount(parseFloat(e.target.value))} value={amount || 0} className="w-full flex flex-row items-center py-2 px-3 border rounded bg-slate-100" />
                                    </div>
                                    {amountError && <p className="text-red-500 text-xs italic">{amountError}</p>}
                                </div>
                                <div>
                                    <h2 className='font-medium my-1 text-lg'>Receiver:</h2>
                                    <input type="text" onChange={(e) => setReceiver(e.target.value)} value={receiver} className="w-full flex flex-row items-center py-2 px-3 border rounded bg-slate-100" />
                                    {receiverError && !receiver && <p className="text-red-500 text-xs italic">{receiverError}</p>}
                                </div>
                                <div className="flex justify-center items-center my-4">
                                    <button
                                        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        onClick={() => handleSend()}
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                            <div className="col-span-1 mx-2">
                                <h2 className="text-4xl xse:text-3xl font-bold text-center italic text-[#00d9e1]">Transactions</h2>
                                <div className="pt-4 mb-4">
                                    {transactions.slice().reverse().map((transaction, index) =>
                                        <div key={index} className={`shadow-md border rounded mb-2 mt-4 mx-2 flex flex-row justify-between items-center p-2 border-l-8 ${transaction.receiver === User.userId ? 'border-l-[#49e9ac]' : 'border-l-[#FF0000]'}`}>
                                            <div>
                                                <h4 className={`mr-2 text-xl font-medium ${transaction.receiver === User.userId ? 'text-[#49e9ac]' : 'text-[#FF0000]'}`}><span className="font-medium text-[#4cdad5] text-lg">{country.currencySymbol} </span>{convertedPrice(transaction.amount, country.currencyRate)}</h4>
                                                <h3 className="break-all"><span className="font-medium">Receiver: </span> {transaction.receiver === User.userId? <span className="text-[#8e30d3] font-medium">You</span>: transaction.receiver}</h3>
                                                <h3 className="break-all"><span className="font-medium">Sender: </span> {transaction.owner === User.userId? <span className="text-[#8e30d3] font-medium">You</span>: transaction.owner}</h3>
                                                <p className="text-gray-500 text-sm break-all">{transaction.date}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div> : create ? <Form handleCreateAccount={handleSend} /> :
                        <div className="flex flex-col justify-center items-center">
                            {isAnyFieldMissing ? <div>
                                <h4 className="font-medium text-[#ff0000] text-lg">Add these in Affinidi to be eligible for this feature</h4>
                                <ul className="flex justify-center items-center flex-col my-1 font-medium">
                                    {missingFields.map((fields, index) => <li className="text-[#00b7ff] flex flex-row items-center justify-center" key={index}><div className="w-2 h-2 rounded-full bg-[#10e4b6] mr-2"></div>{fields}</li>)}
                                </ul>
                            </div> : <h4 className="font-medium text-[#ff9100] text-lg">You are eligible to create your account</h4>}
                            <button disabled={isAnyFieldMissing} onClick={() => setCreate(true)} className={`bg-teal-500 hover:bg-teal-600 ${isAnyFieldMissing && 'hover:cursor-not-allowed bg-gray-500 hover:bg-slate-700'} my-3 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}>Create Account</button>
                            <p className="font-medium text-[#51cad3] text-lg"><FontAwesomeIcon icon={faGifts} className="text-[#40f2ff] mr-1" />Create Account and get a 100$ gift</p>
                        </div>
            }
        </div >
    )
}

export default Bank