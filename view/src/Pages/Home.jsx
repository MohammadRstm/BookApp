import { useState , useEffect} from "react"
import axios from 'axios';
import { renderStars } from "../utils/utils";
import { FaBook, FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";


export default function Home(){

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const [books , setBooks] = useState([]);// initialize to empty array

const loadBooks = async () =>{
    try{
        const response = await axios(`${BASE_URL}/api/books/withRating`);// get all books
        setBooks(response.data);
        console.log(response.data);
    }catch(err){
        console.log(err);
    }
}

useEffect(() =>{
    loadBooks();
} , []);

    return(
        <>
            {books.length === 0 ? (
                <>
                    loading books...
                </>
            ): (
                <>
                    {books.map(book => (
                        <div key={book._id}
                        onClick={window.localStorage.href=`/bookDetails?bookId=${book._id.toString()}`}
                        >
                            <FaBook size={40} />
                            <p>Title : {book.title}</p>
                            <p>Auther : {book.auther}</p>
                            <p>year : {book.year}</p>
                             <div>Rating: {renderStars(book.averageRating)}</div>
                        </div>
                    ))}
                </>
            )}
        </>
    )
}