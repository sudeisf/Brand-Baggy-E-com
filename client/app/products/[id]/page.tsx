"use client"

import { useParams } from "next/navigation";

export default function ProductPage(){
    const params = useParams();
    const {id} = params;
    return(
        <div>
            <h1>Product Page</h1>
            <p>{id}</p>
        </div>
    )
}
