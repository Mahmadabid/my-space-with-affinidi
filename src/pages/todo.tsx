import Edit from "@/components/global/Edit";
import Remove from "@/components/global/Remove";
import GetDate from "@/components/todo/Date";
import Fav from "@/components/todo/Fav";
import { generateRandomId } from "@/components/utils/RandomId";
import { useState } from "react";

interface TodoProps {
    Title: string;
    fav: boolean;
    id: string;
    date: string;
}

const Todo = () => {

    const [title, setTitle] = useState('');
    const [todos, setTodos] = useState<TodoProps[]>([]);
    const [editId, setEditId] = useState('');
    const [editTitle, setEditTitle] = useState('');
    const [titleError, setTitleError] = useState<string | null>(null);
    const [editTitleError, setEditTitleError] = useState<string | null>(null);

    const handleAddTodo = () => {
        setTitleError(null);

        if (!title) {
            setTitleError('Please enter a Title');
        }

        if (title) {
            setTodos(prevTodos => [...prevTodos, { Title: title, fav: false, id: generateRandomId(), date: GetDate() }]);
            setTitle('');
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

    const handleEditTodo = () => {
        setEditTitleError(null);

        if (!editTitle) {
            setEditTitleError('Please enter a Title');
        }

        if (editTitle) {
            setTodos(prevTodos => {
                const updatedTodos = prevTodos.map(todo =>
                    todo.id === editId ? { ...todo, Title: editTitle, date: GetDate() } : todo
                );

                setEditId('');
                setEditTitle('');

                return updatedTodos;
            });
        }
    }

    const handleFav = (id: string) => {
        setTodos(prevTodos => {
            const updatedTodos = prevTodos.map(todo =>
                todo.id === id ? { ...todo, fav: !todo.fav } : todo
            );

            return updatedTodos;
        });
    }

    const handleRemove = (id: string) => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id))
    }

    const sortedTodos = [...todos].sort((a, b) => (b.fav ? 1 : 0) - (a.fav ? 1 : 0));

    return (
        <div className='flex flex-col justify-center items-center'>
            <h2 className='text-6xl xse:text-4xl font-bold mt-3 mb-5 text-indigo-500 italic'>Todos</h2>

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

                            <button onClick={() => handleFav(todo.id)} className='hover:bg-gray-300 rounded-full p-2'>
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
                                        onClick={handleEditTodo}
                                    >
                                        Edit Todo
                                    </button>
                                </div>
                                :
                                <div className='flex flex-col'>
                                    <h2 className='font-medium break-all'>{todo.Title}</h2>
                                    <p className="text-gray-500 break-all">{todo.date}</p>
                                </div>}
                        </div>
                        <div>
                            <button onClick={() => handleEdit(todo.Title, todo.id)} className='hover:bg-gray-300 rounded-full p-2'>
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