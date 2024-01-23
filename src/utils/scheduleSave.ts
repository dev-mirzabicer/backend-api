import { DocumentType } from "@typegoose/typegoose";
import { Request } from "express";

const scheduleSave = (req: Request, doc: DocumentType<any>) => {
    if (!req || !doc) return;
    if (!req.documentsToSave) {
        req.documentsToSave = [];
    }
    // console.log("WKJEIJWDOFIJOEWF");
    // console.log(doc);
    if (!req.documentsToSave.find((ddoc, _) => ddoc._id === doc._id)) {
        req.documentsToSave.push(doc);
    }
};

export default scheduleSave;
