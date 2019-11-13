import {Class} from 'meteor/jagi:astronomy';
import Spreadsheets from "../../lib/collections/Spreadsheets";

const SpreadsheetsContent = Class.create({
    name: 'SpreadsheetsContent',
    fields:{
        symEnc_datas: {
            type:String,
            optional: true,
        },
        columns:{
            type:String,
            default: function () {
                return "[]"
            }
        },
        style:{
            type:String,
            default: function () {
                return "{}"
            }
        }
    }
})

const Spreadsheet = Class.create({
    name: 'Spreadsheet',
    collection: Spreadsheets,
    fields: {
        projectId: {
            type: String,
            index: 1
        },
        createdBy: {
          type:String
        },
        symEnc_name: {
            type:String
        },
        lastActivity:{
            type: Date,
            default: function () {
                return new Date()
            },
            index:-1
        },
        content:{
            type:SpreadsheetsContent,
            default: function () {
                return {};
            }
        }
    },
    helpers: {

    }

});

export default Spreadsheet
