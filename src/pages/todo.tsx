import Edit from "@/components/global/Edit";
import Remove from "@/components/global/Remove";
import GetDate from "@/components/global/Date";
import Fav from "@/components/todo/Fav";
import Load from "@/components/utils/Load";
import { generateRandomId } from "@/components/utils/RandomId";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/utils/Context";

export interface TodoProps {
    title: string;
    fav: boolean;
    id: string;
    date: string;
    owner: string;
}

const Todo = () => {

    const [title, setTitle] = useState('');
    const [fetchData, setFetchData] = useState(false);
    const [todos, setTodos] = useState<TodoProps[]>([]);
    const [editId, setEditId] = useState('');
    const [editTitle, setEditTitle] = useState('');
    const [titleError, setTitleError] = useState<string | null>(null);
    const [editTitleError, setEditTitleError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [User, _] = useContext(UserContext);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await fetch(`/api/todo?owner=${User.userId}`, {
                method: 'GET',
            });

            const data = await res.json();

            if (data.length > 0) {
                setTodos(data);
                setLoading(false);
            }
            else {
                setTodos([]);
                setLoading(false);
            }
        };

        fetchData();
    }, [fetchData]);

    const handleAddTodo = async () => {
        setTitleError(null);

        if (!title) {
            setTitleError('Please enter a Title');
        }

        if (title) {
            try {
                setLoading(true);
                const res = await fetch('api/todo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title, fav: false, id: generateRandomId(User.userId), date: GetDate(), owner: User.userId }),
                });

                if (!res.ok) {
                    throw new Error('Failed to add todo');
                }

                setTitle('');
                setFetchData(prev => !prev);
            } catch (error) {
                console.error('Error adding todo:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleEdit = (title: string, id: string) => {
        setEditId('');
        setEditTitle('');

        if (editId !== id) {
            setEditId(id);
            setEditTitle(title);
        }
    }

    const handleEditTodo = async (id: string) => {
        setEditTitleError(null);

        if (!editTitle) {
            setEditTitleError('Please enter a Title');
        }

        if (editTitle) {
            try {
                setLoading(true);
                const res = await fetch('api/todo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title: editTitle, id, date: GetDate(), edit: 'edit' }),
                });

                if (!res.ok) {
                    throw new Error('Failed to edit todo');
                }

                setFetchData(prev => !prev);
            } catch (error) {
                console.error('Error editing todo:', error);
            } finally {
                setEditId('');
                setEditTitle('');
                setLoading(false);
            }
        }
    }

    const handleFav = async (todo: TodoProps) => {
        try {
            setLoading(true);
            const res = await fetch('api/todo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fav: !todo.fav, id: todo.id, edit: 'fav' }),
            });

            if (!res.ok) {
                throw new Error('Failed to fav todo');
            }

            setFetchData(prev => !prev);
        } catch (error) {
            console.error('Error favorite todo:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleRemove = async (id: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/todo/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            if (!res.ok) {
                throw new Error('Failed to delete todo');
            }

        } catch (error) {
            console.error('Error removing todo:', error);
        } finally {
            setLoading(false);
            setFetchData(prev => !prev)
        }
    };

    const sortedTodos = [...todos].slice().reverse().sort((a, b) => {
        if (b.fav && !a.fav) {
            return 1;
        } else if (!b.fav && a.fav) {
            return -1;
        } else {
            return 0;
        }
    });

    return (
        <div className='flex flex-col justify-center items-center'>
            <h2 className='text-6xl xse:text-4xl font-bold mt-3 mb-5 text-indigo-500 italic'>Todos</h2>

            {loading && (
                <div
                    className="fixed top-0 z-40 left-0 w-full h-full bg-gray-700 opacity-70 flex flex-col space-y-2 items-center justify-center"
                >
                    <Load className='w-9 h-9 fill-white' />
                </div>
            )}

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

            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleAddTodo}
            >
                Add Todo
            </button>

            <div className="my-4 mx-2">
                {sortedTodos.map((todo, index) => (
                    <div className='rounded my-2 p-4 bg-[#ebecff] flex flex-row items-center justify-between space-x-3' key={index}>
                        <div className='flex flex-row space-x-3 justify-center items-center'>

                            <button onClick={() => handleFav(todo)} className='hover:bg-gray-300 rounded-full p-2'>
                                <Fav color={todo.fav ? '#3f51b5' : ''} />
                            </button>

                            {editId === todo.id ?
                                <div className='flex flex-col items-center'>
                                    <input
                                        className={`shadow my-1 xse:min-w-56 appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${editTitleError && !editTitle ? 'border-red-500' : ''
                                            }`}
                                        id="editTitle"
                                        type="text"
                                        placeholder="Enter Title"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                    />
                                    {editTitleError && !editTitle && <p className="text-red-500 text-xs italic">{editTitleError}</p>}

                                    <button
                                        className="bg-teal-500 hover:bg-teal-600 my-2 w-36 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        onClick={() => handleEditTodo(todo.id)}
                                    >
                                        Edit Todo
                                    </button>
                                </div>
                                :
                                <div className='flex flex-col'>
                                    <h2 className='font-medium break-all'>{todo.title}</h2>
                                    <p className="text-gray-500 break-all">{todo.date}</p>
                                </div>}
                        </div>
                        <div>
                            <button onClick={() => handleEdit(todo.title, todo.id)} className='hover:bg-gray-300 rounded-full p-2'>
                                <Edit />
                            </button>
                            <button onClick={() => handleRemove(todo.id)} className='hover:bg-gray-300 rounded-full p-2'>
                                <Remove />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Todo