import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import env from "react-dotenv";
export const useSignup = () => {
    const [error, setError] = useState(null)
    const [isloading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()
    const signup = async (email, password) =>{
        setError(null);
        setIsLoading(null);


        const response = await fetch(`${env.API_URL}/api/user/signup`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        })

        const json = await response.json();

        if (!response.ok){
            setIsLoading(false);
            setError(json.error);
        }

        if(response.ok){
            //Save user to local Storage
            localStorage.setItem('user', JSON.stringify(json));

            //update AuthContext
            dispatch({type: 'LOGIN', payload: json});

            setIsLoading(false);
        }
    }
    return { error, isloading, signup };
}