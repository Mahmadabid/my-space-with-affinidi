import Edit from '@/components/global/Edit';
import Remove from '@/components/global/Remove';
import Links from '@/components/bookmark/Links';
import { useState } from 'react';
import Link from 'next/link';
import { generateRandomId } from '@/components/utils/RandomId';

interface BookmarkProps {
  Title: string;
  url: string;
  id: string;
}

const Bookmarks = () => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [bookmarks, setBookmarks] = useState<BookmarkProps[]>([]);
  const [editId, setEditId] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [urlError, setURLError] = useState<string | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [editUrlError, setEditURLError] = useState<string | null>(null);
  const [editTitleError, setEditTitleError] = useState<string | null>(null);

  const isValidUrl = (inputUrl: string) => {
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(inputUrl);
  };

  const handleAddBookmark = () => {
    setURLError(null);
    setTitleError(null);

    if (!title) {
      setTitleError('Please enter a Title');
    }

    if (!isValidUrl(url)) {
      setURLError('Please enter a valid URL.');
    }

    if (title && isValidUrl(url)) {
      setBookmarks(prevBookmarks => [...prevBookmarks, { Title: title, url, id: generateRandomId() }]);
      setUrl('');
      setTitle('');
    }
  };

  const handleEdit = (title: string, url: string, id: string) => {
    setEditId('');
    setEditTitle('');
    setEditUrl('');

    if (editId !== id) {
      setEditId(id);
      setEditTitle(title);
      setEditUrl(url);
    }
  }

  const handleEditBookmark = () => {
    setEditURLError(null);
    setEditTitleError(null);

    if (!editTitle) {
      setEditTitleError('Please enter a Title');
    }

    if (!isValidUrl(editUrl)) {
      setEditURLError('Please enter a valid URL.');
    }

    if (editTitle && isValidUrl(editUrl)) {
      setBookmarks(prevBookmarks => {
        const updatedBookmarks = prevBookmarks.map(bookmark =>
          bookmark.id === editId ? { ...bookmark, Title: editTitle, url: editUrl } : bookmark
        );

        setEditId('');
        setEditTitle('');
        setEditUrl('');

        return updatedBookmarks;
      });
    }
  }

  const handleRemove = (id: string) => {
    setBookmarks(prevBookmarks => prevBookmarks.filter(bookmark => bookmark.id !== id))
  }

  return (
    <div className='flex flex-col justify-center items-center'>
      <h2 className='text-6xl xse:text-4xl font-bold mt-3 mb-5 text-sky-500 italic'>Bookmarks</h2>

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
        <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="url">
          URL:
        </label>
        <input
          className={`shadow min-w-80 xse:min-w-56 appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${urlError && !isValidUrl(url) ? 'border-red-500' : ''
            }`}
          id="url"
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        {urlError && !isValidUrl(url) && <p className="text-red-500 text-xs italic">{urlError}</p>}
      </div>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleAddBookmark}
      >
        Add Bookmark
      </button>

      <div className="my-4 mx-2">
        {bookmarks.map((bookmark, index) => (
          <div className='rounded my-2 p-6 bg-[#f0f3ff] flex flex-row items-center justify-between space-x-3' key={index}>
            <div className='flex flex-row space-x-3 justify-center items-center'>
              <Link href={bookmark.url} target='_blank' className='hover:bg-gray-300 rounded-full p-2'>
                <Links />
              </Link>
              {editId === bookmark.id ?
                <div className='flex flex-col items-center'>
                  <input
                    className={`shadow my-1 min-w-80 xse:min-w-56 appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${editTitleError && !editTitle ? 'border-red-500' : ''
                      }`}
                    id="editTitle"
                    type="text"
                    placeholder="Enter Title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  {editTitleError && !editTitle && <p className="text-red-500 text-xs italic">{editTitleError}</p>}
                  <input
                    className={`shadow my-1 min-w-80 xse:min-w-56 appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${editUrlError && !isValidUrl(editUrl) ? 'border-red-500' : ''
                      }`}
                    id="editUrl"
                    type="text"
                    placeholder="Enter URL"
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                  />
                  {editUrlError && !isValidUrl(editUrl) && <p className="text-red-500 text-xs italic">{editUrlError}</p>}

                  <button
                    className="bg-teal-500 hover:bg-teal-600 my-2 w-36 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={handleEditBookmark}
                  >
                    Edit Bookmark
                  </button>
                </div>
                :
                <div className='flex flex-col'>
                  <h2 className='font-medium break-all'>{bookmark.Title}</h2>
                  <p className='text-gray-500 break-all'>{bookmark.url}</p>
                </div>}
            </div>
            <div>
              <button onClick={() => handleEdit(bookmark.Title, bookmark.url, bookmark.id)} className='hover:bg-gray-300 rounded-full p-2'>
                <Edit />
              </button>
              <button onClick={() => handleRemove(bookmark.id)} className='hover:bg-gray-300 rounded-full p-2'>
                <Remove />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookmarks;
