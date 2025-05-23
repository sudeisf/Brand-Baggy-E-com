"use client"





export default function OrderDashboard(){
    return (
        <div className="flex items-center justify-around mt-4 px-2">
            <div className="border-1 w-[14rem] p-4 rounded-md space-y-1  shadow-sm">
                <h1 className="text-gray-400 font-roboto font-medium">Total orders</h1>
                <p className="text-2xl font-medium text-gray-600">1230</p>
            </div>
            <div className="border-1 w-[14rem] p-4 rounded-md shadow-sm">
                <h1 className="text-gray-400 font-roboto font-medium">Avg. Order Value</h1>
                <p className="text-2xl font-medium text-gray-600">$123.56</p>
            </div>
            <div className="border-1 w-[14rem] p-4 rounded-md shadow-sm">
                <h1 className="text-gray-400 font-roboto font-medium">Pending Fulfillment</h1>
                <p className="text-2xl font-medium text-gray-600">15</p>
            </div>
            <div className="border-1 w-[14rem] p-4 rounded-md shadow-sm">
                <h1 className="text-gray-400 font-roboto font-medium">Return Rate</h1>
                <p className="text-2xl font-medium text-gray-600">3.2%</p>
            </div>
            <div className="border-1 w-[14rem] p-4 rounded-md shadow-sm">
                <h1 className="text-gray-400 font-roboto font-medium">Deliverd Orders</h1>
                <p className="text-2xl font-medium text-gray-600">1200</p>
            </div>
        </div>
    )
}