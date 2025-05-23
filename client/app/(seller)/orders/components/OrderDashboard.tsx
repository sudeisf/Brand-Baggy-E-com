"use client"





export default function OrderDashboard(){
    return (
        <div className="flex items-center justify-around mt-8 px-2">
            <div className="border-t-4 border-2 w-[14rem] border-t-[#331d67]/80 p-4 rounded-md space-y-1 ">
                <h1 className="text-gray-400 font-roboto font-medium">Total orders</h1>
                <p className="text-xl font-medium text-[#331d67]">1230</p>
            </div>
            <div className="border-t-4 border-2 w-[14rem] border-t-[#331d67]/80 p-4 rounded-md ">
                <h1 className="text-gray-400 font-roboto font-medium">Avg. Order Value</h1>
                <p className="text-xl font-medium text-[#331d67]">$123.56</p>
            </div>
            <div className="border-t-4 border-2 w-[14rem] border-t-[#331d67]/80 p-4 rounded-md ">
                <h1 className="text-gray-400 font-roboto font-medium">Pending Fulfillment</h1>
                <p className="text-xl font-medium text-[#331d67]">15</p>
            </div>
            <div className="border-t-4 border-2 w-[14rem] border-t-[#331d67]/80 p-4 rounded-md ">
                <h1 className="text-gray-400 font-roboto font-medium">Return Rate</h1>
                <p className="text-xl font-medium text-[#331d67]">3.2%</p>
            </div>
            <div className="border-t-4 border-2 w-[14rem] border-t-[#331d67]/80 p-4 rounded-md ">
                <h1 className="text-gray-400 font-roboto font-medium">Deliverd Orders</h1>
                <p className="text-xl font-medium text-[#331d67]">1200</p>
            </div>
        </div>
    )
}