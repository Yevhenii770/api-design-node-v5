import type { Request, Response } from 'express'
import { db } from '../db/connection.ts'
import { users , type NewUser, type User} from '../db/schema.ts'
import { generateToken } from '../utils/jwt.ts'
import { comparePassword, hashPassword } from '../utils/passwords.ts'
import { eq } from 'drizzle-orm'


export const register  = async (req: Request<any, any , NewUser>, res: Response) => {
    try {
        // create hash password 
        const hashedPassword = await hashPassword(req.body.password)

        //return to user 
        const [user] = await db.insert(users).values({
            ...req.body,
            password: hashedPassword
        }).returning({
                id: users.id,
                email: users.email,
                username: users.username,
                firstName: users.firstName,
                lastName: users.lastName,
                createdAt: users.createdAt,

        })
        
        // creating token 
        const token = await generateToken({
            id: user.id,
            email: user.email,
            username: user.username
        })
        
        //returning response for a user with (message, user, token)
        return res.status(201).json({
            message: 'User created',
            user,
            token
        })
    } catch (e) {
        console.error('Registration error', e)
        res.status(500).json({error: 'Failed to create user'})
    }

}

export const login = async (req: Request, res: Response) => {
    try {
        
        const { email, password } = req.body;
        //find first (if broke res = 500)
        const user = await db.query.users.findFirst({
            where:  eq(users.email, email)
        })
        if (!user) {
            return res.status(401).json({error: 'Invalid credentials'})
        }
         //compare password (if broke res = 500)
        const isValidatedPassword = await comparePassword(password, user.password)

        if (!isValidatedPassword) {
            return res.status(401).json({error: 'Invalid credentials'})
        }
         //token generation (if broke res = 500)
        const token = await generateToken({
            id: user.id,
            email: user.email,
            username: user.username
        })

        return res.status(201).json({
            message: 'Login success',
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                createdAt: user.createdAt,
            },
           token,
        })
    } catch(e) {
     console.error('Login error', e)
        res.status(500).json({ error: 'Failed to login'})
    }
}