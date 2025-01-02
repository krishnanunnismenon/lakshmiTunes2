
import Offer from "../../models/offerModel.js"
import { Product } from "../../models/productModel.js";

export const getAllOffers = async(req,res)=>{
    try {
        const offers = await Offer.find()
        .populate('categoryId','name')
        .populate('productId','name price')
        .sort('-createdAt');

        res.json(offers)
    } catch (error) {
        res.status(500).json({message:"Server error fetching offers",error:error.message})
    }
}

export const createOffer = async(req,res)=>{
    try {
        const {
            title,
            description,
            discountType,
            discountValue,
            applicationType,
            categoryId,
            productId,
            startDate,
            endDate
        } = req.body
        
        if(applicationType === 'product'){
            await applyBestOfferToProduct(productId)
        }else{
            const products = await Product.find({category:categoryId})
            console.log(products)
            for (let product of products) {
                await applyBestOfferToProduct(product._id);
            }
        }
        // Validate discount value
    if (discountType === 'percentage' && (discountValue <= 0 || discountValue > 60)) {
        return res.status(400).json({ message: 'Percentage discount must be between 0 and 60' });
      }

      let query = {isActive:true,endDate: { $gte: new Date()}}

      if(applicationType ==='category'){
        query.categoryId = categoryId;
      }else{
        query.productId = productId
      }

      const existingOffer = await Offer.findOne(query);
      

    if (existingOffer) {
        return res.status(400).json({ 
          message: 'An active offer already exists for this category/product' 
        });
      }
    
        const offer = new Offer({
            title,
            description,
            discountType,
            discountValue,
            applicationType,
            ...(applicationType === 'category' ? { categoryId } : { productId }),
            startDate,
            endDate
        });
        await offer.save();
        res.status(201).json(offer)
    } catch (error) {
        res.status(500).json({ message: 'Error creating offer', error: error.message });
    }
}

export const toggleOfferStatus = async(req,res)=>{
    try {
        const offer = await Offer.findById(req.params.id);
        if(!offer){
            return res.status(404).json({message:"Offer not found"})
        }

        offer.isActive = !offer.isActive;
        await offer.save()
        res.json(offer)
    } catch (error) {
        res.status(500).json({message:"Error toggling offer status",error:error.message})
    }
}

export const editOffer = async(req,res)=>{
    try {
        const{
            title,
            description,
            discountType,
            discountValue,
            applicationType,
            categoryId,
            productId,
            startDate,
            endDate,
            isActive
        } = req.body;
        const offerId = req.params.offerId;


        if(applicationType === 'product'){
            await applyBestOfferToProduct(productId)
        }else{
            const products = await Product.find({category:categoryId})
            
            for (let product of products) {
                await applyBestOfferToProduct(product._id);
            }
        }

    if(discountType==='percentage'  && (discountValue<=0 || discountValue>60)){
        return res.status(400).json({message:"Percentage Discount should be between 0 and 60"})
    }

    let query = { isActive: true, endDate: { $gte: new Date() }, _id: { $ne: offerId } };
    if (applicationType === 'category') {
      query.categoryId = categoryId;
    } else if (applicationType === 'product') {
      query.productId = productId;
    }

    const existingOffer =  await Offer.findOne(query);
    if(existingOffer){
        return res.status(400).json({ 
            message: `An active offer already exists for this ${applicationType}` 
          });
    }
    const updatedOffer = await Offer.findByIdAndUpdate(
        offerId,
        {
          title,
          description,
          discountType,
          discountValue,
          applicationType,
          ...(applicationType === 'category' ? { categoryId, productId: null } : { productId, categoryId: null }),
          startDate,
          endDate,
          isActive
        },
        { new: true, runValidators: true }
      );

      if (!updatedOffer) {
        return res.status(404).json({ message: 'Offer not found' });
      }

      res.json(updatedOffer)
      
    } catch (error) {
        console.error('Error updating offer:', error);
        res.status(500).json({ message: 'Error updating offer', error: error.message });
    }
}

export const getIndividualOffer = async(req,res)=>{
    try {
        const offerId = req.params.offerId
        console.log(offerId)
        const individualOffer = await Offer.findOne({_id:offerId})
        
        res.json(individualOffer)
    } catch (error) {
        console.error('Error updating offer:', error);
        res.status(500).json({ message: 'Error getting offer details', error: error.message });
    }
}

const applyBestOfferToProduct = async (productId) => {
    
    const product = await Product.findById(productId);
    if (!product) return;
  
    const offers = await Offer.find({
      $or: [
        { productId: product._id },
        { categoryId: product.category }
      ],
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    });
  
    let bestOffer = null;
    let maxDiscount = 0;
  
    offers.forEach(offer => {
      const discount = offer.discountType === 'percentage'
        ? (product.price * offer.discountValue / 100)
        : offer.discountValue;
      
      if (discount > maxDiscount) {
        maxDiscount = discount;
        bestOffer = offer;
      }
    });
  
    if (bestOffer) {
      product.discountedPrice = bestOffer.discountType === 'percentage'
        ? product.price * (1 - bestOffer.discountValue / 100)
        : product.price - bestOffer.discountValue;
      product.bestOffer = bestOffer._id;
    } else {
      product.discountedPrice = null;
      product.bestOffer = null;
    }
  
    console.log(product)
    await product.save();
    console.log("product offer updated")
  };