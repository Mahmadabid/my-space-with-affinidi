import client from '@/utils/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { TransactionProps } from '../expenses';
import { Client } from 'pg';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const client = new Client(process.env.DATABASE_URL);
        await client.connect();

        await client.query(`
        CREATE TABLE IF NOT EXISTS transaction_table (
          title VARCHAR(255),
          amount NUMERIC,
          id VARCHAR(255),
          date VARCHAR(255),
          type VARCHAR(10),
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
                'SELECT * FROM transaction_table WHERE owner = $1',
                [owner]
            );

            if (result.rows.length === 0) {
                res.status(404).json({ error: 'Owner not found' });
                return;
            }

            res.status(200).json(result.rows);
        } else if (req.method === 'POST') {
            const { title, amount, id, date, type, owner } = req.body as TransactionProps;

            await client.query(
                `
                INSERT INTO transaction_table (id, title, amount, date, type, owner)
                VALUES ($1, $2, $3, $4, $5, $6)
                `,
                [id, title, amount, date, type, owner]
            );

            res.status(200).json({ message: 'Transaction updated successfully' });
        } else if (req.method === 'DELETE') {
            const { id } = req.body;

            await client.query(
                `
                  DELETE FROM transaction_table
                  WHERE id = $1
                  `,
                [id]
            );

            res.status(200).json({ message: 'Transaction deleted successfully' });
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