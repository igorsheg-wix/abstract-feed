import * as Abstract from "abstract-sdk";

const AbstractClient = ({ token }: { token: string }) => {
    const client = new Abstract.Client({
        accessToken: token,
        transportMode: ["api"]
    });
    return client;
};

export { AbstractClient };
