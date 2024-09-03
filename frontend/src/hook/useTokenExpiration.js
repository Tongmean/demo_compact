import { useEffect } from 'react';
import { useAuthContext } from '../hook/useAuthContext';
import { useLogout } from '../hook/useLogout';

// Custom hook to handle token expiration
const useTokenExpiration = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();

  useEffect(() => {
    // Function to check if the JWT token is expired
    const checkTokenExpiration = () => {
      if (user && user.token && isTokenExpired(user.token)) {
        logout(); // Logout user if token is expired
      }
    };

    // Check token expiration immediately and then periodically
    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000); // Check every 5 minutes

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [user, logout]);

  // Function to check if the JWT token is expired
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp; // Token expiration time from the payload
      const now = Math.floor(Date.now() / 1000); // Current time in seconds

      return exp < now; // Return true if token is expired
    } catch (error) {
      // Handle decoding error, for example, if token is malformed
      console.error('Error decoding token:', error);
      return true; // Treat as expired if there's an error
    }
  };
};

export default useTokenExpiration;
