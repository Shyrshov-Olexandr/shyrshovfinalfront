import Joi from "joi";
const loginValidator = Joi.object({
    email: Joi.string().email({tlds: {allow: false}}).required(),
    password: Joi.string().required()
})

export {loginValidator};