import { NextApiRequest, NextApiResponse } from 'next';
import { BankProps } from '../bank';
import pool from '@/utils/db';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');

    const client = await pool.connect();

    try {
        await client.query(`
        CREATE TABLE IF NOT EXISTS bank_table (
        id VARCHAR(255),
        receiver VARCHAR(255),
        date VARCHAR(155),
        owner VARCHAR(255),
        amount NUMERIC
        )
    `);

        if (req.method === 'GET') {
            const { owner } = req.query;

            if (!owner) {
                res.status(400).json({ error: 'Owner parameter is required' });
                return;
            }

            const result = await client.query(
                'SELECT * FROM bank_table WHERE owner = $1 OR receiver = $1;',
                [owner]
            );

            if (result.rows.length === 0) {
                res.status(404).json({ error: 'Owner not found' });
                return;
            }

            res.status(200).json(result.rows);
        } else if (req.method === 'POST') {
            const { amount, receiver, id, owner, date } = req.body as BankProps;

            await client.query(
                `
                  INSERT INTO bank_table (id, amount, receiver, date, owner)
                  VALUES ($1, $2, $3, $4, $5)
                  `,
                [id, amount, receiver, date, owner]
            );

            res.status(200).json({ message: 'Transaction updated successfully' });
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