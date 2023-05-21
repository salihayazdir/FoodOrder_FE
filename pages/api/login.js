import axios from "axios"
import cookie from 'cookie'

export default async function handler(req, res) {

    if(req.method === 'POST'){
        await axios.post("http://localhost:5277/api/auth/login", req.body)
        .then(rsp => {
            const token = rsp.data.token
            const str = "Bearer " + token

            res.status(200)
            .setHeader(
              'Set-Cookie',
              cookie.serialize('Authorization', str, {
                httpOnly: true,
                encode: a => a,
                secure: false,
                maxAge: 24 * 60 * 60,
                sameSite: false,
                path: '/',
              }))
              .json(JSON.parse(JSON.stringify(rsp.data)))
           })
        .catch(res.status(401))
    } else {
        res.status(410).send("nope")
    }

}
