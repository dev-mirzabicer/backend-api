/* eslint-disable indent */
/* eslint-disable @typescript-eslint/ban-types */
import { UserRole } from "../constants";
import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { DocumentType } from "@typegoose/typegoose";
import UserModel, { User } from "../models/user.model";
import ApiError from "../utils/apiError";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

passport.use(
    new JwtStrategy(options, function (jwt_payload, done) {
        UserModel.findById(jwt_payload.sub, function (err: any, user: any) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    })
);

const verification =
    (
        req: Request,
        resolve: Function,
        reject: Function,
        requiredRoles: UserRole[] = []
    ) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (err: Error, user: DocumentType<User>, info: any) => {
        if (err || info || !user) {
            return reject(new ApiError("Unauthorized", 401));
        }
        req.user = user;

        if (requiredRoles.length && !requiredRoles.includes(user.role)) {
            return reject(
                new ApiError("You're not permitted to access this route", 403)
            );
        }
        resolve();
    };

// const auth =
//     (...requiredRoles: UserRole[]) =>
//     async (req: Request, res: Response, next: NextFunction) => {
//         return new Promise((resolve, reject) => {
//             passport
//                 .authenticate(
//                     "jwt",
//                     { session: false },
//                     verification(req, resolve, reject, requiredRoles)
//                 )(req, res, next)
//                 .then(() => next())
//                 // eslint-disable-next-line @typescript-eslint/no-explicit-any
//                 .catch((err: any) => next(err));
//         });
//     };

const auth =
    (...requiredRoles: UserRole[]) =>
    (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate(
            "jwt",
            // { session: false },
            (err: Error, user: DocumentType<User>, info: any) => {
                if (err || info || !user) {
                    return next(new ApiError("Unauthorized", 401));
                }
                req.user = user;

                if (
                    requiredRoles.length &&
                    !requiredRoles.includes(user.role)
                ) {
                    return next(
                        new ApiError(
                            "You're not permitted to access this route",
                            403
                        )
                    );
                }
                // console.log(req.user);
                next();
            }
        )(req, res, next);
    };

export default auth;
