import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import addressReducer from "./features/addressSlice";
import campaignReducer from "./features/dashboardCampaign";
import productReducer from "./features/productSlice";
import cartReducer from "./features/cartSlice";
import orderReducer from "./features/orderSlice";
import exchangeReducer from "./features/exchangeSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        address: addressReducer,
        campaign: campaignReducer,
        product: productReducer,
        cart: cartReducer,
        order: orderReducer,
        exchange: exchangeReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;