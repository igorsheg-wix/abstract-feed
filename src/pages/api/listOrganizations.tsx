/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { NextApiRequest, NextApiResponse } from "next";
import { AbstractClient } from "../../../lib/utils/abstractClient";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const headers = req.headers.authorization;
    const token = headers?.split("bearer ")[1];
    const api = AbstractClient({ token });

    try {
        //@ts-ignore
        const data = await api.organizations.list();
        res.status(200).json(data);
    } catch (err) {
        res.status(401).json({ err: err });
    }
};
