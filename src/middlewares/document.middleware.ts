// import { DocumentType } from "@typegoose/typegoose";

import { Request } from "express";

const saveDocuments = async (req: Request) => {
    if (req.documentsToSave) {
        // req.documentsToSave.forEach(async (doc: DocumentType<any>) => {
        //     await doc.save();
        // });
        for (let i = 0; i < req.documentsToSave.length; i++) {
            // console.log(req.documentsToSave[i]);
            await req.documentsToSave[i].save();
        }
    }
};

export default saveDocuments;
