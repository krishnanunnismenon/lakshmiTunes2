import { adminApi } from "./adminApi";

const dashboardApi = adminApi.injectEndpoints({

    endpoints:(builder)=>({
        getSalesReportData:builder.mutation({
            query:(params)=>({
                url:'admin/dashboard/sales-report',
                method:"GET",
                params
            })
        })
    })
})

export const {useGetSalesReportDataMutation}  = dashboardApi