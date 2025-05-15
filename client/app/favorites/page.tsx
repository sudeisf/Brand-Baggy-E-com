"use client"

import { useState } from "react";
import FavTable from "./components/FavTable";

export default function FavoritesPage() {
    return (
        <div className="container mx-auto px-4 py-5 mb-10">
            <FavTable />
        </div>
    )
}

