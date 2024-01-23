import { DocumentType } from "@typegoose/typegoose";
import { User } from "models/user.model";

declare module "express-serve-static-core" {
    interface Request {
        user?: DocumentType<User>;
        documentsToSave?: Array<DocumentType<any>>;
    }
}

export default "this is a module";
