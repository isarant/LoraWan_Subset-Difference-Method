import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web and AsyncStorage for react-native
import allReducers from "./reducers/allReducers";
import { applyMiddleware } from "redux";
import thunk from "redux-thunk";

const persistConfig = {
  key: "root",
  storage
};

const persistedReducer = persistReducer(persistConfig, allReducers);

export const store = createStore(persistedReducer, applyMiddleware(thunk));
export const persistor = persistStore(store);
// export default () => {
//   let store = createStore(persistReducer, applyMiddleware(thunk));
//   let persistor = persistStore(store);
//   debug.log(persistor);
//   return { store, persistor };
//};
