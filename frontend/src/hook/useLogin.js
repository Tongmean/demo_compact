import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import env from "react-dotenv";
export default function useLogin (){
    const [error, setError] = useState(null);
    const [isLoading, setIsloading] = useState(false);
    const { dispatch } = useAuthContext();
    const login = async (email, password) => {
        setError();
        setIsloading(true);
        try {
                // post (email, password) to server then get response from server
            const response = await fetch(`${env.API_URL}/api/user/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password})
            });
            //
            const json = await response.json();
            if (!response.ok) {
                if (response.status === 401) {
                    setError('Invalid email or password');
                } else {
                    setError(json.message || 'An error occurred');
                }
                setIsloading(false);
                return;
            }

            if(response.ok){
                
                //save response to local storage 
                localStorage.setItem('user', JSON.stringify(json));
                //update value to function reducer
                dispatch({type: 'LOGIN', payload: json});


                setIsloading(false);
            };

        } catch (error) {
            setError(error);

        }finally {
            setIsloading(false);
        }
       
    };
    return {error, isLoading, login};
};