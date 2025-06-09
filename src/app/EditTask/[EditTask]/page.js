"use client"

import React from 'react'
import { useParams } from 'next/navigation';

export default function EditTask() { 

    const params = useParams();
    const { EditTask } = params;

    return ( 
        <div> 
            <h1>GeeksforGeeks</h1> 
            <h2>pathname:- {EditTask}</h2> 
        </div> 
    ) 
}