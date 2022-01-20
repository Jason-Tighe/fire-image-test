import React, {useState, useContext} from 'react'


const AuthContext = React.createContext

export function useAuth(){
  return useContext(AuthContext)
}

export default function Auth ({children})=>{
  return (
    <AuthContext.Provider value={value}>
    {children}
    </AuthContext.Provider>
  )
}
