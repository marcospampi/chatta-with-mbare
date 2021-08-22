import crypto from "crypto";
import fs from "fs/promises";

import express from "express";

export const api = express.Router();

api.get('/uuid', ( _, res ) => res.send(crypto.randomUUID()) );
// serve pictures list
api.get('/pictures', (req, res) => {
    fs.readdir('./static/resources/pictures')
        .then(
            result => res.send( result )
        )
        .catch(
            error => {
                console.error({error})
                res.send([])
            }
        )
});

