import mongoose from 'mongoose';

// Acronym Interface
interface IAcronym {
    acronym: string,
    definition: string
}

// Acronym Model Interface
interface AcronymModelInterface extends mongoose.Model<AcronymDoc> {
    build(attr: IAcronym): AcronymDoc
}

// AcronymDoc Interface
interface AcronymDoc extends mongoose.Document {
    acronym: string,
    definition: string
}

// Acronym Schema Definition
const acronymSchema = new mongoose.Schema({
    acronym: {
        type: String,
        required: true,
        unique: true
    },
    definition: {
        type: String,
        required: true
    }
});

// Acronym build method
acronymSchema.statics.build = (attr: IAcronym) => {
    return new Acronym(attr);
}

// Acronym Model
const Acronym = mongoose.model<any, AcronymModelInterface>("Acronym", acronymSchema);

export {Acronym}