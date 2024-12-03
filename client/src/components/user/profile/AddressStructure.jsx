import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { PenSquare, Plus, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useGetUserAddressQuery, useAddUserAddressMutation, useUpdatePrimaryAddressMutation } from '@/services/api/user/userApi';
import { useToast } from '@/hooks/use-toast';

const addressSchema = Yup.object().shape({
  street: Yup.string().required('Street is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  zipCode: Yup.string().required('Zip Code is required'),
  country: Yup.string().required('Country is required'),
});

const AddressStructure = () => {
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const { data: addresses, isLoading } = useGetUserAddressQuery();
  const [addAddress, { isLoading: isAdding }] = useAddUserAddressMutation();
  const [updatePrimaryAddress] = useUpdatePrimaryAddressMutation();
  const { toast } = useToast();

  const handleAddAddress = async (values, { resetForm }) => {
    try {
      await addAddress(values).unwrap();
      setIsAddingAddress(false);
      resetForm();
      toast({
        description: "Address added successfully",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      toast({
        description: "Failed to add address",
        variant: "destructive",
      });
    }
  };

  const handleSetPrimary = async (addressId) => {
    try {
      await updatePrimaryAddress(addressId).unwrap();
      toast({
        description: "Primary address updated successfully",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      toast({
        description: "Failed to update primary address",
        variant: "destructive",
      });
    }
  };

  return (
    <TabsContent value="address">
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold text-lg">Delivery Addresses</h3>
            <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Address
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Address</DialogTitle>
                </DialogHeader>
                <Formik
                  initialValues={{
                    street: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    country: '',
                  }}
                  validationSchema={addressSchema}
                  onSubmit={handleAddAddress}
                >
                  {({ errors, touched }) => (
                    <Form className="space-y-4">
                      <div>
                        <Label htmlFor="street">Street</Label>
                        <Field name="street" as={Input} id="street" />
                        {errors.street && touched.street && <div className="text-red-500">{errors.street}</div>}
                      </div>
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Field name="city" as={Input} id="city" />
                        {errors.city && touched.city && <div className="text-red-500">{errors.city}</div>}
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Field name="state" as={Input} id="state" />
                        {errors.state && touched.state && <div className="text-red-500">{errors.state}</div>}
                      </div>
                      <div>
                        <Label htmlFor="zipCode">Zip Code</Label>
                        <Field name="zipCode" as={Input} id="zipCode" />
                        {errors.zipCode && touched.zipCode && <div className="text-red-500">{errors.zipCode}</div>}
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Field name="country" as={Input} id="country" />
                        {errors.country && touched.country && <div className="text-red-500">{errors.country}</div>}
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsAddingAddress(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isAdding}>
                          {isAdding ? 'Adding...' : 'Add Address'}
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </DialogContent>
            </Dialog>
          </div>
          {isLoading ? (
            <div>Loading addresses...</div>
          ) : addresses && addresses.length > 0 ? (
            <div className="space-y-4">
              {addresses.map((address) => (
                <Card key={address._id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p>{address.street}</p>
                        <p>{address.city}, {address.state} {address.zipCode}</p>
                        <p>{address.country}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mb-2"
                          onClick={() => handleSetPrimary(address._id)}
                          disabled={address.isPrimary}
                        >
                          {address.isPrimary ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Primary
                            </>
                          ) : (
                            'Set as Primary'
                          )}
                        </Button>
                        <Button variant="outline" size="sm">
                          <PenSquare className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p>No addresses found. Add a new address to get started.</p>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default AddressStructure;