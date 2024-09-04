import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import env from "react-dotenv";

export default function useLogin() {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();

    const login = async (email, password) => {
        setIsLoading(true);
        setError(null); // Reset error before login attempt

        try {
            const response = await fetch(`${env.API_URL}/api/user/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const json = await response.json();

            if (!response.ok) {
                const errorMessage = response.status === 401
                    ? 'Invalid email or password'
                    : json.msg || 'An error occurred';
                setError(errorMessage);
            } else {
                localStorage.setItem('user', JSON.stringify(json));
                dispatch({ type: 'LOGIN', payload: json });
            }
        } catch (err) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return { error, isLoading, login };
}
