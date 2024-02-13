import GetDate from "@/components/global/Date";
import Remove from "@/components/global/Remove";
import Load from "@/components/utils/Load"
import { generateRandomId } from "@/components/utils/RandomId";
import { UserContext } from "@/utils/Context";
import { CountryContext } from "@/utils/CountryContext";
import { useContext, useEffect, useState } from "react";

export interface TransactionProps {
  title: string;
  id: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  owner: string;
}

const Expenses = () => {

  const [country] = useContext(CountryContext);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [fetchData, setFetchData] = useState(false);
  const [title, setTitle] = useState('');
  const [amountError, setAmountError] = useState<string | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [transactions, setTransactions] = useState<TransactionProps[]>([]);
  const [User, _] = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch(`/api/expense?owner=${User.userId}`, {
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

  const handleAddTransaction = async () => {
    setTitleError(null);
    setAmountError(null);

    if (!title) {
      setTitleError('Please enter a Title');
    }

    if (amount <= 0) {
      setAmountError('Please enter amount more than 0');
    }

    if (title && amount > 0) {
      try {
        setLoading(true);
        const res = await fetch('api/expense', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, amount, id: generateRandomId(User.userId), date: GetDate(), type, owner: User.userId }),
        });

        if (!res.ok) {
          throw new Error('Failed to add transaction');
        }

        setAmount(0);
        setTitle('');
        setFetchData(prev => !prev);
      } catch (error) {
        console.error('Error adding transaction:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRemove = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/expense/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error('Failed to delete transaction');
      }

    } catch (error) {
      console.error('Error removing transaction:', error);
    } finally {
      setLoading(false);
      setFetchData(prev => !prev)
    }
  };

  const calculateBalance = () => {
    if (transactions.length === 0) {
      return 0;
    } else {
      return transactions.reduce((total, transaction) => (transaction.type === 'income' ? total + transaction.amount : total - transaction.amount), 0);
    }
  };

  const calculateIncome = () => {
    if (transactions.length === 0) {
      return 0;
    } else {
      return transactions.reduce((total, transaction) => (transaction.type === 'income' ? total + transaction.amount : total + 0), 0);
    }
  };

  const calculateExpense = () => {
    if (transactions.length === 0) {
      return 0;
    } else {
      return transactions.reduce((total, transaction) => (transaction.type === 'expense' ? total + transaction.amount : total + 0), 0);
    }
  };

  return (
    <div className='flex flex-col justify-center items-center'>
      <h2 className='text-6xl xse:text-4xl font-bold mt-3 mb-5 text-[#8300ff] italic'>Expenses</h2>
      {loading && (
        <div
          className="fixed top-0 z-40 left-0 w-full h-full bg-gray-900 opacity-95 flex flex-col space-y-2 items-center justify-center"
        >
          <Load className='w-9 h-9 fill-white' />
        </div>
      )}

      <div className="w-[350px] xse:w-[320px] xb:w-[270px] mt-3 flex flex-col px-2">
        <h3 className='font-medium text-xl'>Your Balance</h3>
        <p className={`text-3xl font-medium  break-all ${calculateBalance() > 0 ? 'text-[#00ff5e]' : calculateBalance() < 0 ? 'text-[#FF0000]' : 'text-slate-600'}`}>{country.currencySymbol} {calculateBalance()}</p>

        <div className="border rounded p-5 my-3 flex justify-center space-x-10 items-center flex-row shadow-md">
          <div className="flex flex-col">
            <h3 className="font-medium text-xl">Income</h3>
            <p className="text-xl text-[#00ff5e] font-medium break-all">{country.currencySymbol} {calculateIncome()}</p>
          </div>
          <div className="h-12 w-[1px] bg-gray-300" />
          <div className="flex flex-col">
            <h3 className="font-medium text-xl">Expense</h3>
            <p className="text-xl text-[#FF0000] font-medium  break-all">{country.currencySymbol} {calculateExpense()}</p>
          </div>
        </div>

        <div className="my-2">
          <h3 className="font-medium text-xl mt-2">Add Transaction</h3>
          <div className="h-[1px] w-full mt-2 mb-4 bg-gray-400" />

          <div className="flex flex-col justify-center items-center my-2">
            <div className="mb-4">
              <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="title">
                Title:
              </label>
              <input
                className={`shadow min-w-80 xse:min-w-56 appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${titleError && !title ? 'border-red-500' : ''
                  }`}
                id="title"
                type="text"
                placeholder="Enter Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {titleError && !title && <p className="text-red-500 text-xs italic">{titleError}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="amount">
                Amount:
              </label>
              <input
                className={`shadow min-w-80 xse:min-w-56 appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${amountError ? 'border-red-500' : ''
                  }`}
                id="amount"
                type="number"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
              {amountError && <p className="text-red-500 text-xs italic">{amountError}</p>}
            </div>

            <div className="flex items-center mt-2 mb-4">
              <input
                type="radio"
                id="income"
                name="transactionType"
                value="income"
                checked={type === 'income'}
                onChange={() => setType('income')}
              />
              <label htmlFor="income" className="ml-2 font-medium text-[#00ff5e]">Income</label>

              <input
                type="radio"
                id="expense"
                name="transactionType"
                value="expense"
                checked={type === 'expense'}
                onChange={() => setType('expense')}
                className="ml-4"
              />
              <label htmlFor="expense" className="ml-2 font-medium text-[#FF0000]">Expense</label>
            </div>

            <button
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleAddTransaction}
            >
              Add Transaction
            </button>
          </div>
        </div>

        <div className="my-2">
          <h3 className="font-medium text-xl">Transaction History</h3>
          <div className="h-[1px] w-full mt-2 bg-gray-400" />
          {transactions.slice().reverse().map((transaction, index) =>
            <div key={index} className={`shadow-md border rounded my-2 flex flex-row justify-between items-center p-2 border-l-8 ${transaction.type === 'income' ? 'border-l-green-500' : 'border-l-[#FF0000]'}`}>
              <div>
                <h3 className="font-medium text-lg break-all">{transaction.title}</h3>
                <p className="text-gray-500 text-sm break-all">{transaction.date}</p>
              </div>
              <div className="flex flex-row items-center">
                <h4 className={`break-all mr-2 font-medium ${transaction.type === 'income' ? 'text-[#00ff5e]' : 'text-[#FF0000]'}`}>{country.currencySymbol} {transaction.amount}</h4>
                <button onClick={() => handleRemove(transaction.id)} className='hover:bg-gray-300 rounded-full p-2'>
                  <Remove />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Expenses