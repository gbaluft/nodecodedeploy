import Counter from './counter_schema.js';
import { v4 as uuidv4 } from 'uuid';


async function generateCustomId (colletionName,prefix){
    if (!colletionName || !prefix){
        throw Error ('Collection Name and Prefix required')
    }
    const updateQuery ={
        $inc : {seq:1}
    }
    const options = {new:true, upsert:true};
    try {
        //find the counter document for the specified collection name and update its seq field
        const counter = await Counter.findOneAndUpdate(
            {colletionName},
            updateQuery,
            options
        )
        //Extract the updated sequence number
        const {seq} = counter;
        //Generate a UUID;
        const uuid = uuidv4();
        //create the custom id combining prefix, seq and uuid
        const customId = `${prefix}-${seq}-${uuid}`
        return customId;
    } catch {
        throw Error ('Error ID generation in ${collectionName}')
    }
}

export default generateCustomId;