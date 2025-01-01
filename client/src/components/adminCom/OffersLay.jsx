import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PenSquare, Plus } from 'lucide-react';
import { useGetOffersQuery, useToggleOfferStatusMutation } from '@/services/api/admin/offerApi';
import { useToast } from '@/hooks/use-toast';

const OffersLay = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: offers, isLoading } = useGetOffersQuery();
  const [toggleStatus] = useToggleOfferStatusMutation();

  const handleToggleStatus = async (offerId) => {
    try {
      await toggleStatus(offerId).unwrap();
      toast({
        description: "Offer status updated successfully",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      toast({
        description: "Failed to update offer status",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">OFFERS</h1>
        <Button 
          onClick={() => navigate('/admin/offers/add')}
          className="bg-yellow-600 hover:bg-yellow-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add offer
        </Button>
      </div>

      <Card className="bg-gray-900">
        <CardContent className="p-0">
          <div className="grid grid-cols-3 gap-4 p-4 border-b border-gray-800 font-medium text-gray-400">
            <div>PRODUCTS</div>
            <div>OFFER</div>
            <div>ACTION</div>
          </div>
          
          {offers?.map((offer) => (
            <div 
              key={offer._id} 
              className="grid grid-cols-3 gap-4 p-4 border-b border-gray-800 items-center"
            >
              <div className="text-white">
                {offer.applicationType === 'product' 
                  ? offer.productId?.name 
                  : `${offer.categoryId?.name} (Category)`}
              </div>
              <div className="text-white">
                {offer.discountValue}
                {offer.discountType === 'percentage' ? '%' : ' Rs'}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={offer.isActive ? "outline" : "destructive"}
                  size="sm"
                  style={{ minWidth: "70px" }}
                  onClick={() => handleToggleStatus(offer._id)}
                >
                  {offer.isActive ? 'LIST' : 'UNLIST'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/admin/offers/edit/${offer._id}`)}
                >
                  <PenSquare className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default OffersLay;