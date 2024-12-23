import { useAddUserAddressMutation } from '@/services/api/user/userApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  house: Yup.string().required('House/Street is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  pincode: Yup.string().required('Pincode is required'),
  country: Yup.string().required('Country is required'),
  phone: Yup.number().typeError('Phone must be a number').required('Phone number is required'),
  isPrimary: Yup.boolean()
})

export default function AddressForm({ onAddressSubmit }) {
  const [addAddress, { isLoading }] = useAddUserAddressMutation()
  const { toast } = useToast()

  const initialValues = {
    name: '',
    house: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    phone: '',
    isPrimary: false
  }

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await addAddress(values).unwrap()

      toast({
        title: "Success",
        description: "Address added successfully",
        status: "success"
      })

      onAddressSubmit()
      resetForm()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add address",
        status: "error"
      })
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form className="space-y-4">
          <h3 className="font-medium mb-4">Add New Address</h3>
          
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Field
              as={Input}
              id="name"
              name="name"
              className={errors.name && touched.name ? "border-red-500" : ""}
            />
            <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <Label htmlFor="house">House/Street</Label>
            <Field
              as={Input}
              id="house"
              name="house"
              className={errors.house && touched.house ? "border-red-500" : ""}
            />
            <ErrorMessage name="house" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <Label htmlFor="city">City</Label>
            <Field
              as={Input}
              id="city"
              name="city"
              className={errors.city && touched.city ? "border-red-500" : ""}
            />
            <ErrorMessage name="city" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <Label htmlFor="state">State</Label>
            <Field
              as={Input}
              id="state"
              name="state"
              className={errors.state && touched.state ? "border-red-500" : ""}
            />
            <ErrorMessage name="state" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <Label htmlFor="pincode">Pincode</Label>
            <Field
              as={Input}
              id="pincode"
              name="pincode"
              className={errors.pincode && touched.pincode ? "border-red-500" : ""}
            />
            <ErrorMessage name="pincode" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <Label htmlFor="country">Country</Label>
            <Field
              as={Input}
              id="country"
              name="country"
              className={errors.country && touched.country ? "border-red-500" : ""}
            />
            <ErrorMessage name="country" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Field
              as={Input}
              id="phone"
              name="phone"
              type="tel"
              className={errors.phone && touched.phone ? "border-red-500" : ""}
            />
            <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div className="flex items-center">
            <Field
              type="checkbox"
              id="isPrimary"
              name="isPrimary"
              className="mr-2"
            />
            <Label htmlFor="isPrimary">Set as primary address</Label>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Save Address
          </Button>
        </Form>
      )}
    </Formik>
  )
}

