import { createContext } from "react";




export const Context = createContext();
const ContextProvider =(props)=>{
    const contextValue ={

    }
    return (
        <Context.Prvider value={contextValue}>
            {props.children}
        </Context.Prvider>
    )

}
export default ContextProvider