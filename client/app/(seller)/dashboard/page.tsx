"use client"

import Dashheads from "./components/Dashheads"
import RecentOrdersTable from "./components/Recentorders"

export default function Dashboard(){
    return (
        <div className="w-[1250px] mx-auto bg-white">
            <Dashheads />
            <RecentOrdersTable/>
        </div>
    )
}