import { adminApi } from "./adminApi"

const offerApi = adminApi.injectEndpoints({
        endpoints:(builder)=>({
            getOffers:builder.query({
                query:()=>({
                    url:'admin/offers',
                    method:"GET"
                }),
                providesTags:['Offers']
            }),
            toggleOfferStatus:builder.mutation({
                query:(id)=>({
                    url:`admin/offers/${id}/toggle`,
                    method:"PUT"
                }),
                invalidatesTags:['Offers']
            }),
            createOffer: builder.mutation({
                query:(offerData)=>({
                    url:'admin/offers',
                    method:"POST",
                    body:offerData
                }),
                invalidatesTags:['Offers']
            }),
            getIndividualOffer:builder.query({
                query:(offerId)=>({
                url:`admin/offers/${offerId}`,
                method:'GET'  
                }),
                providesTags: (result, error, id) => [{ type: 'Offers', id }],
            }),
            editIndividualOffer: builder.mutation({
                query:({id,...editedData})=>({
                    url:`admin/offers/${id}/edit`,
                    method:"PUT",
                    body:editedData
                }),
                invalidatesTags:['Offers']
            })
        })
})

export const {useGetOffersQuery,useToggleOfferStatusMutation,
            useCreateOfferMutation,
            useGetIndividualOfferQuery,useEditIndividualOfferMutation
} = offerApi