import express from 'express';
import {  createOffer, editOffer, getAllOffers, getIndividualOffer, toggleOfferStatus } from '../../controllers/admin/adminOfferController.js';


const adminOfferRouter = express.Router();

adminOfferRouter.get('/',getAllOffers)
adminOfferRouter.post('/',createOffer)
adminOfferRouter.put('/:id/toggle',toggleOfferStatus)
adminOfferRouter.get('/:offerId',getIndividualOffer)
adminOfferRouter.put('/:offerId/edit',editOffer)

export default adminOfferRouter;
