import { NextApiRequest, NextApiResponse } from 'next';

const ApiTemplate = (req: NextApiRequest, res: NextApiResponse) => {
    const {
        query: { name },
    } = req;
    res.status(200).json({ name });
};

export default ApiTemplate;
