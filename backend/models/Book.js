const mongoose = require("mongoose");
const {Schema , model , Types} = mongoose;

const bookShcema = new Schema({
    title:{type:String , requred:true},
    author:{type:String , requred:true},
    description:{type:String , default:"N/A"},
    genre:{type:String , requred:true},
    year:{type:Number , required:true},
    addedBy:{type:Types.ObjectId , ref:'User'}
},{
    collection: 'Books'
});

module.exports = model('Book' , bookShcema);