import axios from "axios";
import { useEffect, useState } from "react"
import { FaBook, FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa"
import { renderStars } from "../utils/utils";

//  works (alledgedly)

export default function BookDetails(){

    const [bookDetails , setBookDetails] = useState(null);


    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const loadBookDetails = async (id) =>{
        try{
            const response = await axios.get(`${BASE_URL}/api/books/withRating/${id}`);// no authorization needed
            setBookDetails(response.data.bookDetails);
        }catch(err){
            if(err.response)
                alert(err.response.data.message || 'Server error');
            else
                alert('Network error');
        }
    }

    useEffect(() =>{
        const queryParam = new URLSearchParams(window.location.search);
        if(queryParam){// as a string
            const id = queryParam.get('bookId');
            loadBookDetails(id);
        }
    } , []);



    return(
        <>
        {!bookDetails ? (
            <>
                <p>Loading Details...</p>
            </>
        ) : (
            <>
            <div>
                <FaBook size={100} />
                <div>Rating : {renderStars(bookDetails.averageRating)}</div>
                <p>Title : {bookDetails.title}</p>
                <p>Author : {bookDetails.author}</p>
                <p>year : {bookDetails.year}</p>
                <p>genre : {bookDetails.genre}</p>
                <p>description : {bookDetails.description}</p>   
            </div>
            <div>
                {bookDetails.reviews.map((review , index) => (
                    <div key={index}>
                        <p>{review.reviewText}</p>
                        <p>{review.rating}</p>
                    </div>
                ))}
            </div>
            </>
        )}
        </>
    )
}