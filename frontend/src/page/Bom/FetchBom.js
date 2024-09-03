import {useState, useEffect} from 'react';
import { useAuthContext } from '../../hook/useAuthContext'

const FetchBom = (url) => {
    const [data, setData] = useState();
	const [isPending, SetIsPending] = useState();
	const [error, setError] = useState();
	//AbortCont 
	// const abortCont = AbortCotroller();
    const { user } = useAuthContext(); // Retrieve user context

	useEffect(()=>{
		//signal When fetch data was interupt
        fetch(url,{
            methods: "GET",
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        .then(res => {
            if(!res.ok) {    // Check if got response from api
                throw Error('Could nor fetch data');  // Throw Error massage
            }
            return res.json(); //Return respond to Json
        })
        .then(data => {
            setData(data);        // add response data to useState(data)
            SetIsPending(false);  // Let loading run if setData(data) not yet complete
            setError(null);       // If fetch data succesfull then setErorr(Null)
        })
        .catch(err => {
            if(err.name === "AbortError"){
                console.log("Fetch aborted");
            }else{
                SetIsPending(false);  
                setError(err.message);
            }
        });
		
	},[url])
	return {data, isPending, error}
}

export default FetchBom;