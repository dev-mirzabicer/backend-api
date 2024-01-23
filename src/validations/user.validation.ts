import { Validation } from "../interfaces";
import Joi from "joi";
import { JoiConstants, UserRole } from "../constants";

const userValidation = new Validation();

const userRolesJoi = Joi.string().valid(...Object.values(UserRole));

userValidation.more = {
    changeRole: {
        body: Joi.object().keys({
            role: userRolesJoi.required(),
        }),
        params: userValidation.idParams.required(),
    },
    patchMe: {
        body: Joi.object().keys({
            //username: ...
            password: JoiConstants.PASSWORD.optional(),
            avatar: Joi.string().optional(), //maybe same for avatar? idk
            // preferredTags: Joi.object().keys({}).optional(),
            // preferredCategories: Joi.array().items(Joi.string()).optional(),
            name: JoiConstants.NAME.optional(),
        }),
    },
    getMe: {
        query: userValidation.getOne.query,
    },
};

userValidation.addQueryForMany({
    role: userRolesJoi,
    name: JoiConstants.NAME,
});

export default userValidation;
