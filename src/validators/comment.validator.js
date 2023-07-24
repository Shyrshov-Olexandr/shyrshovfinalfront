import Joi from "joi";

const commentValidator = Joi.object({

    id: Joi.number(),

    comment: Joi.string().min(1).max(100).required().messages({
        'string.pattern.base': 'min 1 max 100 symbols'
    })
})

export {commentValidator};