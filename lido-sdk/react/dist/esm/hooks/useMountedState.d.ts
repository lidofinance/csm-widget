import { Dispatch, SetStateAction } from 'react';
export declare const useMountedState: <S>(initialState: S | (() => S)) => [S, Dispatch<SetStateAction<S>>];
