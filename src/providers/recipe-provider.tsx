"use client"

import React, {createContext} from 'react';

type Props = {
    children: React.ReactNode
};

export type RecipeContextProps = {

}

const Context = createContext<RecipeContextProps>({});

export const RecipeProvider = ({children}: Props) => {
 return (
  <Context.Provider value={{}}>
   {children}
  </Context.Provider>
 );
};