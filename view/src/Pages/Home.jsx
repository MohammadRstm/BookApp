import { useState } from "react"
import axios from 'axios';

export default function Home(){

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const [books , setBooks] = useState([]);// initialize to empty array

    const loadBooks = async () =>{
        const books = await axios(`${BASE_URL}/api/books/`)// get all books
    }



    return(
        <>
            <h1>Hello , world</h1>
        </>
    )
}