import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true
    },
    discountType:{
        type:String,
        enum:['percentage','amount'],
        required:true
    },
    discountValue:{
        type:Number,
        required:true
    },
    applicationType:{
        type:String,
        enum:['category','product'],
        required:true
    },
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required: function() {
            return this.applicationType === 'category';
          }
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required: function() {
            return this.applicationType === 'product';
          }
    },
    isActive:{
        type:Boolean,
        default:true
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    }
},{
    timestamps:true
});


//index for querying
offerSchema.index({ applicationType: 1, categoryId: 1, productId: 1 });

// to check if the offer is valid
offerSchema.methods.isValid = function() {
    const now = new Date();
    return this.isActive && now >= this.startDate && now <= this.endDate;
  };

  const Offer = mongoose.model('Offer',offerSchema);

  export default Offer