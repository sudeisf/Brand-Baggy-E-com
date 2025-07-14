"use client"

import { Button } from "@/components/ui/button"
import { CreateOrder } from "./components/CreateorderSheet"
import OrderDashboard from "./components/OrderDashboard"
import { Download } from "lucide-react"
import OrdersTable from "./components/OrdersTable"
import { useExportCsv } from "@/hooks/use-order"





export default function Orders(){
    const { data: csvBlob, error, isLoading } = useExportCsv();

    const handleDownload = () => {
      if (error) {
        alert("Export failed: " + error.message);
        return;
      }
      if (!csvBlob) return;
      if (csvBlob.type === "application/json") {
        csvBlob.text().then((text: string) => {
          const err = JSON.parse(text);
          alert(err.detail || "Unknown error");
        });
        return;
      }
      const url = window.URL.createObjectURL(csvBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "seller_orders.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    }; 
    return (
        <div className="w-[1250px] mx-auto min-h-svh">
            <div className="flex justify-between px-5 mt-6">
                <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold font-roboto text-[#331d67]/90">Order</h1>
                <p className="text-gray-500 font-medium font-roboto">Organize all of orderd products</p>
                </div>
                <div className = "flex gap-2 ">
                    <Button variant = "outline" className="rounded-sm shadow-xs">Today</Button>
                    <Button onClick={handleDownload} disabled={isLoading || !!error || !csvBlob} variant="outline" className="rounded-sm flex gap-2 shadow-2xs">
                        <Download/>
                        Export
                        </Button>
                    <CreateOrder/>
                </div>
            </div>
            <OrderDashboard/>
            <OrdersTable/>
        </div>
    )
}