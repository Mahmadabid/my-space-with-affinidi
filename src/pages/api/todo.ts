import client from '@/utils/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'pg';
import { TodoProps } from '../todo';

interface ReqProps extends TodoProps {
    edit?: 'edit' | 'fav';
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const client = new Client(process.env.DATABASE_URL);
        await client.connect();

        await client.query(`
        CREATE TABLE IF NOT EXISTS todo_table (
        id VARCHAR(255),
        title VARCHAR(255),
        fav BOOLEAN,
        date VARCHAR(255),
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
                'SELECT * FROM todo_table WHERE owner = $1',
                [owner]
            );

            if (result.rows.length === 0) {
                res.status(404).json({ error: 'Owner not found' });
                return;
            }

            res.status(200).json(result.rows);
        } else if (req.method === 'POST') {
            const { title, fav, id, owner, date, edit } = req.body as ReqProps;

            if (edit === 'edit') {
                await client.query(
                    `
                UPDATE todo_table
                SET title = $2, date = $3
                WHERE id = $1
                `,
                    [id, title, date]
                );
            } else if (edit === 'fav') {
                await client.query(
                    `
                UPDATE todo_table
                SET fav = $2
                WHERE id = $1
                `,
                    [id, fav]
                );
            } else {
                await client.query(
                    `
                  INSERT INTO todo_table (id, title, fav, date, owner)
                  VALUES ($1, $2, $3, $4, $5)
                  `,
                    [id, title, fav, date, owner]
                );
            }

            res.status(200).json({ message: 'Todo updated successfully' });
        } else if (req.method === 'DELETE') {
            const { id } = req.body;

            await client.query(
                `
                DELETE FROM todo_table
                WHERE id = $1
                `,
                [id]
            );

            res.status(200).json({ message: 'Todo deleted successfully' });
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