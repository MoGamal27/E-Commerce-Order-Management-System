import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { PrismaClient } from '@prisma/client'
import * as bcrypt from "bcrypt";
import { AppError } from "../utils/appError";
import generateToken from "../middleware/generateJWT";



const prisma = new PrismaClient();

const signUp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  
    const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

    const user  = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
        },
    });

    const token = await generateToken({ id: user.id, role: user.role });

    res.status(201).json({
        status: "success",
        message: "User registered successfully",
        token: token,
    });
    next();
    });

    
    const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
       

        const user = await prisma.user.findUnique({
             where: {
                email: req.body.email
             },
         });
         
         if(!user){
            return next(new AppError("User Not exist", 401));
        }
 
         if(!(await bcrypt.compare(req.body.password, user.password))) {
             return next(new AppError("Incorrect email or password", 401));
         }

         const token = await generateToken({ id: user.id, role: user.role });
 
         res.status(200).json({
             status: "success",
             message: "User logged in successfully",
             token: token, 
         });
         next();
     });
        
    export { 
        signUp,
        login
    };