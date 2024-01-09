import mongoose from 'mongoose';

const formSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    mailId: {
        type: String,
        required: true
    },
    facebook: {
        type: String
    },
    twitter: {
        type: String
    },
    phoneNumbers: [
        {
            primaryContact: {
                type: String,
                required: true
            },
            secondaryContact: {
                type:String
            }
        }
    ],
    phNumbers: [
        {
            number: {
                type: String
            }
        }
    ]});

const formFields = mongoose.model('formFields', formSchema);

export default formFields;