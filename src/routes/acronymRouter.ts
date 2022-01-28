import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Acronym } from '../model/Acronym';

const router = express.Router();

// GET /acronym
// url-query params: search "required" , page "optional - defaults to 1 ", limit "optional - defaults to 2"
router.get('/acronym', async (req: Request, res: Response) => {
    let page = parseInt(String(req.query.page));
    let limit = parseInt(String(req.query.limit));
    if (req.query.page == null) {
        page = 1;
    }
    if (req.query.limit == null) {
        limit = 2;
    }
    let regExp = new RegExp(String(req.query.search), 'gi');
    const total = await Acronym.find({ "acronym": regExp }).countDocuments();
    if (total - ((page) * limit)  > 0) {
        let uri = encodeURI(`http://localhost:${process.env.PORT}/acronym?page=${page + 1}&limit=${limit}&search=${req.query.search}`);
        res.setHeader('Link', `<${uri}>;rel="next"`);
    }
    let docs = await Acronym.find({ "acronym": regExp }).sort({ "acronym": "asc" }).limit(limit).skip((page - 1) * limit);
    if (docs.length == 0) {
        return res.send({ "message": "No acronyms found !" });
    }
    return res.send({ "data": docs });
});

// POST /acronym
// Body Parameters: { "acronym": "required and unique", "definition": "required"}
router.post('/acronym', async (req: Request, res: Response) => {
    if (req.body.acronym == null || req.body.acronym == "") {
        return res.status(400).send({ "message": "acronym cannot be null" });
    }
    if (req.body.definition == null || req.body.definition == "") {
        return res.status(400).send({ "message": "definition cannot be null" });
    }
    const { acronym, definition } = req.body;
    let doc = await Acronym.findOne({ "acronym": acronym });
    if (doc != null) {
        return res.status(400).send({"message":"Acronym already exist !"});
    } else {

        const acr = Acronym.build({ acronym, definition });
        await acr.save();
    }
    return res.status(201).send({"message":"Acronym Saved"});
});


// PATCH /acronym
// path params: acronymID "required"
router.patch('/acronym/:acronymID', async (req: Request, res: Response) => {
    const acronymID = req.params.acronymID;
    try {
        let doc = await Acronym.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(acronymID) }, req.body);
        if (doc == null) {
            return res.status(500).send({"message":"Cannot Update a non existent ID"});
        }
    } catch (e) {
        return res.status(500).send({"message":"Updating Acronym failed"});
    }
    return res.status(200).send({"message":"Updated Acronym"});
});

// DELETE /acronym 
// path params: acronymID "required"
router.delete('/acronym/:acronymID', async (req: Request, res: Response) => {
    let acronymID = req.params.acronymID
    try {

        let doc = await Acronym.findByIdAndDelete({ _id: new mongoose.Types.ObjectId(acronymID) });
        if (doc == null) {
            return res.status(400).send({"message":"Cannot Delete a non existent ID"});
        }
    } catch (e) {
        return res.status(500).send({"message":"Deletion failed"});
    }
    return res.status(200).send({"message":"DELETED acronym"});
});

export { router as acronymRouter };