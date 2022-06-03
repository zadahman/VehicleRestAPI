import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import {act} from "react-dom/test-utils";

export interface VehiclesState {
    isLoading: boolean;
    startVehicleIndex?: number;
    vehicles: Vehicles[];
}

export interface Vehicles {
    id: number;
    make: string;
    model: string;
    year: number;
}

// actions are getAll, getSpecific, update, create, and delete

interface GetAllVehiclesAction {
    type: 'GET_ALL_VEHICLES';
    startVehicleIndex: number;
    vehicles: Vehicles[];
}

interface CreateVehicleAction {
    type: 'CREATE_VEHICLE';
    startVehicleIndex: number;
    vehicles: Vehicles[];
}

interface CreateVehicleAction {
    type: 'CREATE_VEHICLE';
    startVehicleIndex: number;
    vehicles: Vehicles[];
}

interface CreateVehicleAction {
    type: 'CREATE_VEHICLE';
    startVehicleIndex: number;
    vehicles: Vehicles[];
}

interface CreateVehicleAction {
    type: 'CREATE_VEHICLE';
    startVehicleIndex: number;
    vehicles: Vehicles[];
}

interface RequestVehicleAction {
    type: 'REQUEST_VEHICLES';
    startVehicleIndex: number;
}

type Actions = GetAllVehiclesAction | CreateVehicleAction | RequestVehicleAction;

export const actionCreators = {
    requestVehicles: (startVehicleIndex: number): AppThunkAction<Actions> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.vehicles && startVehicleIndex !== appState.vehicles.startVehicleIndex) {
            fetch(`api/Vehicle`)
                .then(response => response.json() as Promise<Vehicles[]>)
                .then(data => {
                    dispatch({ type: 'GET_ALL_VEHICLES', startVehicleIndex: startVehicleIndex, vehicles: data });
                });

            dispatch({ type: 'REQUEST_VEHICLES', startVehicleIndex: startVehicleIndex });
        }
    },
    createVehicle: (newVehicle: object, startVehicleIndex: number): AppThunkAction<Actions> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.vehicles) {
            fetch(`api/Vehicle`,{
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newVehicle),
            })
                .then(response => response.json() as Promise<Vehicles[]>)
                .then(data => {
                    dispatch({ type: 'CREATE_VEHICLE', startVehicleIndex: startVehicleIndex, vehicles: data });
                });

            dispatch({ type: 'REQUEST_VEHICLES', startVehicleIndex: startVehicleIndex });
        }
    },
    getOneVehicle: (newVehicle: object, startVehicleIndex: number): AppThunkAction<Actions> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.vehicles) {
            fetch(`api/Vehicle`,{
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newVehicle),
            })
                .then(response => response.json() as Promise<Vehicles[]>)
                .then(data => {
                    dispatch({ type: 'CREATE_VEHICLE', startVehicleIndex: startVehicleIndex, vehicles: data });
                });

            dispatch({ type: 'REQUEST_VEHICLES', startVehicleIndex: startVehicleIndex });
        }
    },
    editVehicle: (newVehicle: object, startVehicleIndex: number): AppThunkAction<Actions> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.vehicles) {
            fetch(`api/Vehicle`,{
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newVehicle),
            })
                .then(response => response.json() as Promise<Vehicles[]>)
                .then(data => {
                    dispatch({ type: 'CREATE_VEHICLE', startVehicleIndex: startVehicleIndex, vehicles: data });
                });

            dispatch({ type: 'REQUEST_VEHICLES', startVehicleIndex: startVehicleIndex });
        }
    },
    deleteVehicle: (newVehicle: object, startVehicleIndex: number): AppThunkAction<Actions> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.vehicles) {
            fetch(`api/Vehicle`,{
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newVehicle),
            })
                .then(response => response.json() as Promise<Vehicles[]>)
                .then(data => {
                    dispatch({ type: 'CREATE_VEHICLE', startVehicleIndex: startVehicleIndex, vehicles: data });
                });

            dispatch({ type: 'REQUEST_VEHICLES', startVehicleIndex: startVehicleIndex });
        }
    }
};

const unloadedState: VehiclesState = { vehicles: [], isLoading: false };

export const reducer: Reducer<VehiclesState> = (state: VehiclesState | undefined, incomingAction: Action): VehiclesState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as Actions;
    switch (action.type) {
        case 'REQUEST_VEHICLES':
            return {
                vehicles: state.vehicles,
                isLoading: true,
                startVehicleIndex: action.startVehicleIndex,
            };
        case 'GET_ALL_VEHICLES':
            if (action.startVehicleIndex === state.startVehicleIndex) {
                return {
                    startVehicleIndex: action.startVehicleIndex,
                    vehicles: action.vehicles,
                    isLoading: false
                };
            }
        case 'CREATE_VEHICLE':
            if (action.startVehicleIndex === state.startVehicleIndex) {
                var newList = [...state.vehicles];
                var rcvdList = [action.vehicles];
                // @ts-ignore
                newList.push(...rcvdList);
                
                return {
                    startVehicleIndex: action.startVehicleIndex,
                    vehicles: newList,
                    isLoading: false
                };
            }
            break;
    }

    return state;
};
