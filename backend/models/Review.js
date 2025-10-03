import mongoose from "mongoose";

const {Schema , Types , model} = mongoose;


const reviewSchema = new Schema({
    bookId :{type: Types.ObjectId , ref:'Book'},
    userId :{type: Types.ObjectId , ref:'User'},
    rating :{type:Number},
    reviewText:{type:String}
},{
    collection:'Reviews'
});



export default model('Review' , reviewSchema);