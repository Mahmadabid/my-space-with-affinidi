import Edit from '@/components/global/Edit';
import Remove from '@/components/global/Remove';
import Links from '@/components/bookmark/Links';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { generateRandomId } from '@/components/utils/RandomId';
import Load from '@/components/utils/Load';

export interface BookmarkProps {
  title: string;
  url: string;
  id: string;
  owner: string;
}

const Bookmarks = () => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [fetchData, setFetchData] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkProps[]>([]);
  const [editId, setEditId] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [urlError, setURLError] = useState<string | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [editUrlError, setEditURLError] = useState<string | null>(null);
  const [editTitleError, setEditTitleError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const Owner = 'aaaaa1';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch(`/api/bookmark?owner=${Owner}`, {
        method: 'GET',
      });

      const data = await res.json();

      if (data.length > 0) {
        setBookmarks(data);
        setLoading(false);
      }
      else {
        setBookmarks([]);
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchData]);

  const isValidUrl = (inputUrl: string) => {
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(inputUrl);
  };

  const handleAddBookmark = async () => {
    setURLError(null);
    setTitleError(null);

    if (!title) {
      setTitleError('Please enter a Title');
    }

    if (!isValidUrl(url)) {
      setURLError('Please enter a valid URL.');
    }

    if (title && isValidUrl(url)) {
      try {
        setLoading(true);
        const res = await fetch('api/bookmark', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, url, id: generateRandomId(), owner: Owner }),
        });

        if (!res.ok) {
          throw new Error('Failed to add Bookmark');
        }

        setUrl('');
        setTitle('');
        setFetchData(prev => !prev);
      } catch (error) {
        console.error('Error adding bookmark:', error);
      } finally {
        setLoading(false);
      }
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

  const handleEditBookmark = async (id: string) => {
    setEditURLError(null);
    setEditTitleError(null);

    if (!editTitle) {
      setEditTitleError('Please enter a Title');
    }

    if (!isValidUrl(editUrl)) {
      setEditURLError('Please enter a valid URL.');
    }

    if (editTitle && isValidUrl(editUrl)) {
      try {
        setLoading(true);
        const res = await fetch('api/bookmark', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: editTitle, url: editUrl, id, edit: true }),
        });

        if (!res.ok) {
          throw new Error('Failed to edit Bookmark');
        }

        setFetchData(prev => !prev);
      } catch (error) {
        console.error('Error editing bookmark:', error);
      } finally {
        setEditId('');
        setEditTitle('');
        setEditUrl('');
        setLoading(false);
      }
    }
  }

  const handleRemove = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookmark/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error('Failed to delete bookmark');
      }

    } catch (error) {
      console.error('Error removing bookmark:', error);
    } finally {
      setLoading(false);
      setFetchData(prev => !prev)
    }
  };

  return (
    <div className='flex flex-col justify-center items-center'>
      <h2 className='text-6xl xse:text-4xl font-bold mt-3 mb-5 text-sky-500 italic'>Bookmarks</h2>

      {loading && (
        <div
          className="fixed top-0 z-40 left-0 w-full h-full bg-gray-900 opacity-95 flex flex-col space-y-2 items-center justify-center"
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
        {bookmarks.slice().reverse().map((bookmark, index) => (
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
                    onClick={() => handleEditBookmark(bookmark.id)}
                  >
                    Edit Bookmark
                  </button>
                </div>
                :
                <div className='flex flex-col'>
                  <h2 className='font-medium break-all'>{bookmark.title}</h2>
                  <p className='text-gray-500 break-all'>{bookmark.url}</p>
                </div>}
            </div>
            <div>
              <button onClick={() => handleEdit(bookmark.title, bookmark.url, bookmark.id)} className='hover:bg-gray-300 rounded-full p-2'>
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
