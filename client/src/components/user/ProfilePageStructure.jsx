import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast'; 
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PenSquare, LogOut, Package, MapPin, Lock, Wallet, Loader2, X } from 'lucide-react';
import { 
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useSendOtpMutation,
  useVerifyOtpMutation
} from '@/services/api/user/userApi';
import AddressStructure from './profile/AddressStructure';
import OrdersStructure from './profile/OrdersStructure';

const ProfilePageStructure = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [otp, setOtp] = useState('');


  const { data: user, isLoading: isLoadingUser } = useGetUserProfileQuery();
 
  
  
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();
  const [changePassword, { isLoading: isChangingPw }] = useChangePasswordMutation();
  



const handleUpdateProfile = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newName = formData.get('name');
    const newEmail = formData.get('email');
    const newPhone = formData.get('phone');

    if (newEmail !== user.email) {
      
      try {
        await sendOtp({ email: newEmail }).unwrap();
        setIsVerifyingEmail(true);
        toast({
          description: "OTP sent to your new email. Please verify.",
          className: "bg-blue-500 text-white",
        });
      } catch (error) {
        toast({
          description: "Failed to send OTP",
          variant: "destructive",
        });
      }
    } else {

      try {
        await updateProfile({ name: newName , phone: newPhone}).unwrap();
        setIsEditingProfile(false);
        toast({
          description: "Profile updated successfully",
          className: "bg-green-500 text-white",
        });
      } catch (error) {
        toast({
          description: "Failed to update profile",
          variant: "destructive",
        });
      }
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await verifyOtp({ email: document.getElementById('email').value, otp }).unwrap();
      const newName = document.getElementById('name').value;
      const newPhone = document.getElementById('phone').value;
      await updateProfile({ name: newName, email: document.getElementById('email').value, phone: newPhone}).unwrap();
      setIsVerifyingEmail(false);
      setIsEditingProfile(false);
      toast({
        description: "Email verified and profile updated successfully",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      toast({
        description: "Failed to verify OTP",
        variant: "destructive",
      });
    }
  };

  const handleResendOtp = async () => {
    try {
      await sendOtp({ email: document.getElementById('email').value }).unwrap();
      toast({
        description: "OTP resent successfully",
        className: "bg-blue-500 text-white",
      });
    } catch (error) {
      toast({
        description: "Failed to resend OTP",
        variant: "destructive",
      });
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    if (formData.get('newPassword') !== formData.get('confirmPassword')) {
      toast({
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    try {
        await changePassword({
            currentPassword: formData.get('currentPassword'),
        newPassword: formData.get('newPassword')
      }).unwrap();
      setIsChangingPassword(false);
      toast({
        description: "Password changed successfully",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      toast({
          description: "Failed to change password",
          variant: "destructive",
        });
    }
};

  
  if (isLoadingUser) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      );
    }
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <Tabs defaultValue="profile" className="space-y-6">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="profile" className="gap-2">
                  <PenSquare className="w-4 h-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="orders" className="gap-2">
                  <Package className="w-4 h-4" />
                  Orders
                </TabsTrigger>
                <TabsTrigger value="address" className="gap-2">
                  <MapPin className="w-4 h-4" />
                  Address

                </TabsTrigger>
                <TabsTrigger value="wallet" className="gap-2">
                  <Wallet className="w-4 h-4" />
                  Wallet
                </TabsTrigger>
              </TabsList>
              <Button 
                variant="ghost" 
                className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => {
                  localStorage.removeItem('token');
                  navigate('/login');
                }}
              >
                <LogOut className="w-4 h-4" />
                Log out
              </Button>
            </div>

            <TabsContent value="profile" className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{user?.name || 'User'}</h2>
                  <p className="text-muted-foreground">{user?.email}</p>
                  <p className="text-muted-foreground">{user?.phone}</p>
                </div>
                <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <PenSquare className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" defaultValue={user?.name || ""} />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" defaultValue={user?.email} />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" name="phone" type="number" defaultValue={user?.phone} />
                      </div>  
                      
                      {isVerifyingEmail && (
                        <div>
                          <Label htmlFor="otp">OTP</Label>
                          <Input 
                            id="otp" 
                            name="otp" 
                            value={otp} 
                            onChange={(e) => setOtp(e.target.value)}
                          />
                          <div className="flex justify-end gap-2 mt-2">
                            <Button type="button" onClick={handleVerifyOtp} disabled={isVerifyingOtp}>
                              {isVerifyingOtp ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                              Verify OTP
                            </Button>
                            <Button type="button" onClick={handleResendOtp} disabled={isSendingOtp}>
                              {isSendingOtp ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                              Resend OTP
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsEditingProfile(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isUpdating || isVerifyingEmail}>
                          {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>


              <Separator />

              <Dialog >
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Lock className="w-4 h-4" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" name="currentPassword" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" name="newPassword" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" name="confirmPassword" type="password" />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsChangingPassword(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isChangingPw}>
                        {isChangingPw ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Change Password
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="orders">
              <OrdersStructure/>
            </TabsContent>

            <AddressStructure/>

            <TabsContent value="wallet">
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    {/* <div>
                      <h3 className="font-semibold">Wallet Balance</h3>
                      <p className="text-2xl font-bold mt-2">₹{user.walletBalance || 0}</p>
                    </div> */}
                    <Button variant="outline">Add Money</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePageStructure;