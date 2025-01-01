import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { PenSquare, Plus, Check, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useGetUserAddressQuery, useAddUserAddressMutation, useUpdatePrimaryAddressMutation, useUpdateUserAddressMutation, useDeleteUserAddressMutation } from '@/services/api/user/userApi';
import { useToast } from '@/hooks/use-toast';

const nonEmptyString = (value) => {
  return value && value.trim().length > 0;
};

const addressSchema = Yup.object().shape({
  name: Yup.string().required('Name is required').test('non-empty', 'Name cannot be empty or just whitespace', nonEmptyString),
  house: Yup.string().required('House/Street is required').test('non-empty', 'House cannot be empty or just whitespace', nonEmptyString),
  city: Yup.string().required('City is required').test('non-empty', 'City cannot be empty or just whitespace', nonEmptyString),
  state: Yup.string().required('State is required').test('non-empty', 'State cannot be empty or just whitespace', nonEmptyString),
  pincode: Yup.string().required('Pincode is required').test('non-empty', 'Pincode cannot be empty or just whitespace', nonEmptyString),
  country: Yup.string().required('Country is required').test('non-empty', 'Country cannot be empty or just whitespace', nonEmptyString),
  phone: Yup.number().typeError('Phone must be a number')
});

const AddressStructure = () => {
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const { data: addresses, isLoading } = useGetUserAddressQuery();
  const [addAddress, { isLoading: isAdding }] = useAddUserAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateUserAddressMutation();
  const [updatePrimaryAddress] = useUpdatePrimaryAddressMutation();
  const [deleteAddress] = useDeleteUserAddressMutation();
  const { toast } = useToast();

  const handleAddAddress = async (values, { resetForm }) => {
    try {
      await addAddress(values).unwrap();
      resetForm();
      toast({
        description: "Address added successfully",
        className: "bg-green-500 text-white",
      });
      setIsAddingAddress(false)
    } catch (error) {
      toast({
        description: "Failed to add address",
        variant: "destructive",
      });
    }
  };

  const handleEditAddress = async (values, { resetForm }) => {
    try {
      await updateAddress({ id: editingAddress._id, ...values }).unwrap();
      resetForm();
      toast({
        description: "Address updated successfully",
        className: "bg-green-500 text-white",
      });
      setEditingAddress(null);
    } catch (error) {
      toast({
        description: "Failed to update address",
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

  const handleDeleteButton = async(addressId) => {
    try {
      await deleteAddress(addressId).unwrap();
      toast({
        description: "Address deleted successfully",
        className: "bg-green-500 text-white",
      })
    } catch (error) {
      toast({
        description: "Failed to delete address",
        variant: "destructive",
      });
    }
  }

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
                    name: '',
                    house: '',
                    city: '',
                    state: '',
                    pincode: '',
                    country: '',
                    phone: '',
                  }}
                  validationSchema={addressSchema}
                  onSubmit={handleAddAddress}
                >
                  {({ errors, touched }) => (
                    <Form className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Field name="name" as={Input} id="name" />
                        {errors.name && touched.name && <div className="text-red-500">{errors.name}</div>}
                      </div>
                      <div>
                        <Label htmlFor="house">House/Street</Label>
                        <Field name="house" as={Input} id="house" />
                        {errors.house && touched.house && <div className="text-red-500">{errors.house}</div>}
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
                        <Label htmlFor="pincode">Pincode</Label>
                        <Field name="pincode" as={Input} id="pincode" />
                        {errors.pincode && touched.pincode && <div className="text-red-500">{errors.pincode}</div>}
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Field name="country" as={Input} id="country" />
                        {errors.country && touched.country && <div className="text-red-500">{errors.country}</div>}
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Field name="phone" as={Input} id="phone" type="tel" />
                        {errors.phone && touched.phone && <div className="text-red-500">{errors.phone}</div>}
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
                        <p>{address.name}</p>
                        <p>{address.house}</p>
                        <p>{address.city}, {address.state} {address.pincode}</p>
                        <p>{address.country}</p>
                        <p>Phone: {address.phone}</p>
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
                        <Dialog open={editingAddress && editingAddress._id === address._id} onOpenChange={(open) => !open && setEditingAddress(null)}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setEditingAddress(address)}>
                              <PenSquare className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Address</DialogTitle>
                            </DialogHeader>
                            <Formik
                              initialValues={{
                                name: address.name,
                                house: address.house,
                                city: address.city,
                                state: address.state,
                                pincode: address.pincode,
                                country: address.country,
                                phone: address.phone,
                              }}
                              validationSchema={addressSchema}
                              onSubmit={handleEditAddress}
                            >
                              {({ errors, touched }) => (
                                <Form className="space-y-4">
                                  <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Field name="name" as={Input} id="name" />
                                    {errors.name && touched.name && <div className="text-red-500">{errors.name}</div>}
                                  </div>
                                  <div>
                                    <Label htmlFor="house">House/Street</Label>
                                    <Field name="house" as={Input} id="house" />
                                    {errors.house && touched.house && <div className="text-red-500">{errors.house}</div>}
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
                                    <Label htmlFor="pincode">Pincode</Label>
                                    <Field name="pincode" as={Input} id="pincode" />
                                    {errors.pincode && touched.pincode && <div className="text-red-500">{errors.pincode}</div>}
                                  </div>
                                  <div>
                                    <Label htmlFor="country">Country</Label>
                                    <Field name="country" as={Input} id="country" />
                                    {errors.country && touched.country && <div className="text-red-500">{errors.country}</div>}
                                  </div>
                                  <div>
                                    <Label htmlFor="phone">Phone</Label>
                                    <Field name="phone" as={Input} id="phone" type="tel" />
                                    {errors.phone && touched.phone && <div className="text-red-500">{errors.phone}</div>}
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button type="button" variant="outline" onClick={() => setEditingAddress(null)}>
                                      Cancel
                                    </Button>
                                    <Button type="submit" disabled={isUpdating}>
                                      {isUpdating ? 'Updating...' : 'Update Address'}
                                    </Button>
                                  </div>
                                </Form>
                              )}
                            </Formik>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteButton(address._id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
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

