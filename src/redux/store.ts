import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import addressReducer from "./features/addressSlice";
import campaignReducer from "./features/dashboardCampaign";
import productReducer from "./features/productSlice";
import cartReducer from "./features/cartSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        address: addressReducer,
        campaign: campaignReducer,
        product: productReducer,
        cart: cartReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;