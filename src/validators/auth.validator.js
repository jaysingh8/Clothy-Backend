import {body , validationResult } from 'express-validator'



function validationResultReq(req,res,next){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
    next()
}

export const validateRegisterUser =[
    body("email")
        .isEmail().withMessage("Invalid email format"),
    body("contact")
        .notEmpty().withMessage("Contact is required")
        .matches(/^\d{10}$/).withMessage("contact must be a 10 digit number"),
    body("password")
        .isLength({min:6}).withMessage("password must be at least 6 characters"),
    body("fullname")
        .notEmpty().withMessage("full name is required")
        .isLength({min:3}).withMessage("full name must conatain at least 3 character"),
    body("isSeller")
        .isBoolean().withMessage("isSeller must be a boolean value"),
        validationResultReq

]


export const validateLogin = [
    body("email")
        .isEmail().withMessage("Invalid email format"),
    body("password")
        .isLength({min:6}).withMessage("password must be at least 6 characters"),
    validationResultReq
]