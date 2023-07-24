import Joi from "joi";

const formValidator = Joi.object({
    name: Joi.string().regex(/^[a-zA-ZА-Яа-яёЁґҐєЄ ]{1,20}$/).required().messages({
        'string.pattern.base': 'Letters only min 1 max 20 symbols'
    }),
    username: Joi.string().regex(/^[a-zA-ZА-Яа-яёЁґҐєЄ._\d]{1,20}$/).required().messages({'string.pattern.base': 'min 1 max 20 symbols no special symbols dots and underscores are allowed'}),
    email: Joi.string().email({tlds: {allow: false}}).required()
})

export {formValidator};