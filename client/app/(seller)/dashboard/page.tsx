"use client"

import Dashheads from "./components/Dashheads"
import RecentOrdersTable from "./components/Recentorders"

export default function Dashboard(){
    return (
        <div className="w-full max-w-[1250px] mx-auto bg-white px-2 sm:px-4">
            <Dashheads />
            <RecentOrdersTable/>
        </div>
    )
}