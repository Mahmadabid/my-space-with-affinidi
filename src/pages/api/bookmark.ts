import client from '@/utils/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'pg';
import { BookmarkProps } from '../bookmarks';

interface ReqProps extends BookmarkProps {
    edit?: boolean;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const client = new Client(process.env.DATABASE_URL);
        await client.connect();

        await client.query(`
    CREATE TABLE IF NOT EXISTS bookmark_table (
      id VARCHAR(255),
      title VARCHAR(255),
      url VARCHAR(2048),
      owner VARCHAR(255)
    )
  `);

        if (req.method === 'GET') {
            const { owner } = req.query;

            if (!owner) {
                res.status(400).json({ error: 'Owner parameter is required' });
                return;
            }

            const result = await client.query(
                'SELECT * FROM bookmark_table WHERE owner = $1',
                [owner]
            );

            if (result.rows.length === 0) {
                res.status(404).json({ error: 'Owner not found' });
                return;
            }

            res.status(200).json(result.rows);
        } else if (req.method === 'POST') {
            const { title, url, id, owner, edit } = req.body as ReqProps;

            if (edit) {
                await client.query(
                    `
                UPDATE bookmark_table
                SET title = $2, url = $3
                WHERE id = $1
                `,
                    [id, title, url]
                );
            } else {
                await client.query(
                    `
                  INSERT INTO bookmark_table (id, title, url, owner)
                  VALUES ($1, $2, $3, $4)
                  `,
                    [id, title, url, owner]
                );
            }

            res.status(200).json({ message: 'Bookmark updated successfully' });
        } else if (req.method === 'DELETE') {
            const { id } = req.body;

            await client.query(
                `
          DELETE FROM bookmark_table
          WHERE id = $1
          `,
                [id]
            );

            res.status(200).json({ message: 'Bookmark deleted successfully' });
        } else {
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.end();
    }
}