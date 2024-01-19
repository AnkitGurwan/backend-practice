import mongoose from "mongoose";


const itemSchema = new mongoose.Schema({
    firstName: {
        type:String,
        required:true
    },
    lastName: {
        type:String,
        required:true
    },
    url: {
        type:String,
        required:true
    }
})

const Item = mongoose.model('item',itemSchema);
export default Item;