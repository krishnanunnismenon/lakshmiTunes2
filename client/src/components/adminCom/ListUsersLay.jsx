'use client'

import { useState } from 'react'
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useGetUsersQuery, useBlockUserMutation } from '@/services/api/admin/adminApi'
import { useToast } from '@/hooks/use-toast' 

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.toLocaleString('default', { month: 'long' })
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

export default function ListUsersLay() {
  const { data: users, isLoading, error: fetchError } = useGetUsersQuery()
  const [blockUser] = useBlockUserMutation()
  const [actioningUser, setActioningUser] = useState(null)
  const { toast } = useToast()
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [userToBlock, setUserToBlock] = useState(null)

  const handleBlockUnblock = async (user) => {
    setActioningUser(user._id)
    try {
      const response = await blockUser({ userId: user._id, block: !user.isBlock }).unwrap()
      toast({
        title: user.isBlock ? "User Unblocked" : "User Blocked",
        description: response.message || `User ${user.isBlock ? 'unblocked' : 'blocked'} successfully`,
        variant: "success",
        className: "bg-green-500 text-white",
      })
    } catch (error) {
      console.error('Failed to update user status:', error)
      toast({
        title: "Error",
        description: error.data?.message || "Failed to update user status. Please try again.",
        variant: "destructive",
        className: "bg-red-500 text-white",
      })
    } finally {
      setActioningUser(null)
      setIsConfirmOpen(false)
    }
  }

  const openBlockConfirmation = (user) => {
    if (!user.isBlock) {
      setUserToBlock(user)
      setIsConfirmOpen(true)
    } else {
      handleBlockUnblock(user)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-red-500">Error loading users: {fetchError.message}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">USERS</h1>
        <div className="space-x-2">
          <Button variant="outline" className="text-yellow-500 border-yellow-500">
            SALES REPORT
          </Button>
          <Button variant="outline" className="text-yellow-500 border-yellow-500">
            NO. OF ORDERS
          </Button>
          <Button variant="outline" className="text-yellow-500 border-yellow-500">
            CURRENT USERS
          </Button>
        </div>
      </div>
      
      <div className="rounded-lg bg-[#1a1b1e] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-800">
              <TableHead className="text-gray-400 font-semibold">USERS</TableHead>
              <TableHead className="text-gray-400 font-semibold">MOBILE</TableHead>
              <TableHead className="text-gray-400 font-semibold">EMAIL</TableHead>
              <TableHead className="text-gray-400 font-semibold">JOINED ON</TableHead>
              <TableHead className="text-gray-400 font-semibold">ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user._id} className="border-b border-gray-800">
                <TableCell className="font-medium text-white">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <img src={user.profileImage || '/placeholder.svg'} alt={user.name} className="rounded-full" />
                    </Avatar>
                    {user.name}
                  </div>
                </TableCell>
                <TableCell className="text-white">
                  <div className="flex items-center gap-2">
                    {user.phone}
                    {user.isOnline && (
                      <span className="w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-white">{user.email}</TableCell>
                <TableCell className="text-white">
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell>
                  <Button
                    variant={user.isBlock ? "outline" : "destructive"}
                    size="sm"
                    onClick={() => openBlockConfirmation(user)}
                    disabled={actioningUser === user._id}
                    className={user.isBlock 
                      ? "bg-green-500 hover:bg-green-600 text-white font-semibold" 
                      : "bg-red-500 hover:bg-red-600 text-white font-semibold"}
                  >
                    {actioningUser === user._id 
                      ? (user.isBlock ? 'UNBLOCKING...' : 'BLOCKING...') 
                      : (user.isBlock ? 'UNBLOCK' : 'BLOCK')}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Block User</DialogTitle>
            <DialogDescription>
              Are you sure you want to block {userToBlock?.name}? This action will prevent the user from accessing the platform.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => handleBlockUnblock(userToBlock)}>
              Confirm Block
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}