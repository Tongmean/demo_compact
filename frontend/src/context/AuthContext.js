import { createContext, useReducer, useEffect } from 'react';
// create context
// step 1 (createContext)
export const AuthContext = createContext();
// function reducer for condition
export const authReducer = (state, action) => {
    switch (action.type){
        case 'LOGIN':
            return {user: action.payload}
        case 'LOGOUT':
            return {user: null}
        default:
            return state

    };
};
// step 2 (context Provider)
export const AuthContextProvider = ({children}) => {
    //state reducer for condition
    //initial state is local memory
    const [state, dispatch] = useReducer(authReducer, {
        user:JSON.parse(localStorage.getItem('user'))
    });
    
    //Retrive user from local storage
    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem('user'))
        if(user){
            dispatch({type: 'LOGIN', payload: user})
        }
    },[])
    
    return(
        <AuthContext.Provider value={{...state, dispatch}}>
            {children}
        </AuthContext.Provider>
    );
};