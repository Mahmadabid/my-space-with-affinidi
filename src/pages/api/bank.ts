import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/utils/db';

interface BankProps {
    owner: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const client = await pool.connect();

    try {
        await client.query(`
        CREATE TABLE IF NOT EXISTS bank_table (
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
                'SELECT * FROM bank_table WHERE owner = $1',
                [owner]
            );

            if (result.rows.length === 0) {
                res.status(404).json({ error: 'Owner not found' });
                return;
            }

            res.status(200).json(result.rows);
        } else if (req.method === 'POST') {
            const { owner } = req.body as BankProps;

            await client.query(
                `
                  INSERT INTO bank_table (owner)
                  VALUES ($1)
                  `,
                [owner]
            );

            res.status(200).json({ message: 'Bank updated successfully' });
        } else {
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
}