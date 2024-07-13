const jwt = require('jsonwebtoken')
let dotenv = require('dotenv')
dotenv.config()
let secretKey = process.env.SECRET_KEY

// declare module 'express-serve-static-core' {
//     interface Request {
//         user?: string | JwtPayload;
//     }
// }

const tokenVerify = async (req, res, next) => {
    try {
        
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if(token){
            // const ifLogin = await login.findOne({
            //     where: {
            //         token
            //     }
            // })
    
            // if (ifLogin) {
    
                jwt.verify(token, secretKey, (err, decode) => {
                    if (err) {
                        res.json({
                            status: false,
                            message: 'Token Not Valid....'
                        })
                    } else {
                        req.user = decode;
                        next()
                    }
                })
    
            // } else {
            //     res.json({
            //         status: false,
            //         message: 'Unauthorized Access...'
            //     })
            // }
        }else{
            res.json(
                {
                    status: false,
                    message: 'Please provide Token...'
                }
            )
        }

    } catch (error) {
        res.json({
            error : error.message,
            message: 'Internal Server Error'
        })
    }
};


module.exports = tokenVerify