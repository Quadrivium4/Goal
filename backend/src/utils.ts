import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";


const validateEmail = (email: string) => {
    const expression = /([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|\[[\t -Z^-~]*])/i;
    return expression.test(String(email).toLowerCase());
}
const tryCatch = (controller: any) => async (req, res, next) => {
    try {
        await controller(req, res, next);
    } catch (error) {
        console.log("error in try catch")
        return next(error)
    }
}
const hashPassword = (password: string) =>{
    return new Promise((resolve, reject)=>{
        bcrypt.hash(password, 10, (err, hash)=>{
            if (err) reject(err);
            resolve(hash);
        })
    })
}
const comparePassword = (password: string, hashedPassword: string) =>{
    return new Promise((resolve, reject)=>{
        bcrypt.compare(password, hashedPassword, (err, result)=>{
            if(err) reject(err);
            resolve(result);
        })
    })
}
const createTokens = (id: string, email: string)=>{
    const aToken = jwt.sign({ email, id}, process.env.JWT_A_TOKEN_KEY);
    const rToken = jwt.sign({ email, id}, process.env.JWT_R_TOKEN_KEY);
    return {aToken, rToken}
}
function extractBearerToken(req){
    if (!req.headers.authorization) return false
    if (!req.headers.authorization.startsWith("Bearer ")) return false;
    const token = req.headers.authorization.split(" ")[1];
    return token;
}
export {
    validateEmail,
    tryCatch,
    hashPassword,
    comparePassword,
    createTokens,
    extractBearerToken
}