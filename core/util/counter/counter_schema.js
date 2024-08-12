import { Schema } from "mongoose";
import db from '../../../config/db.js';

let schema = Schema;

let counterSchema = new schema ({
    colletionName :{type:String, required:true},
    seq:{type:Number,default:0}
},{
    version:false,
    strict:true,
    collection:'Counter'
})

const counter = db.model('Counter',counterSchema);
export default counter;
