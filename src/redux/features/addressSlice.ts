import { addressAPI } from "@/services/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchAddresses = createAsyncThunk(
  "address/fetchAddresses",
  async (userId: number, { rejectWithValue }: any) => {
    try {
      const response = await addressAPI.getAddresses(userId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch addresses",
      );
    }
  },
);
export const addAddress = createAsyncThunk(
  "address/addAddress",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await addressAPI.addAddress(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add address",
      );
    }
  },
);
export const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async ({ id, data }: any, { rejectWithValue }) => {
    try {
      const response = await addressAPI.updateAddress(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update address",
      );
    }
  },
);
export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (id: number, { rejectWithValue }) => {
    try {
      await addressAPI.deleteAddress(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || " Failed to delete address",
      );
    }
  },
);
interface AddressState {
  addresses: any[];
  selectedAddressId: number | null;
  isLoading: boolean;
  error: string | null;
}
const getInitialSelectedAddress = () => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("selectedAddressId");
    if (saved) return Number(saved);
  }
  return null;
};

const initialState: AddressState = {
  addresses: [],
  selectedAddressId: getInitialSelectedAddress(),
  isLoading: false,
  error: null,
};
const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setSelectedAddress: (state, action) => {
      state.selectedAddressId = action.payload;
      if (typeof window !== "undefined" && action.payload !== null) {
        localStorage.setItem("selectedAddressId", action.payload.toString());
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAddresses.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchAddresses.fulfilled, (state, action) => {
      state.isLoading = false;
      state.addresses = action.payload?.data || action.payload;
    });
    builder.addCase(fetchAddresses.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    builder.addCase(deleteAddress.fulfilled, (state, action) => {
      state.addresses = state.addresses.filter(
        (addr) => addr.id !== action.payload,
      );
    });
    builder.addCase(addAddress.fulfilled, (state, action) => {
      const newAddr = action.payload?.data || action.payload;
      if (newAddr && typeof newAddr === 'object') {
        state.addresses.push(newAddr);
      }
    });
    builder.addCase(updateAddress.fulfilled, (state, action) => {
      const updatedAddr = action.payload?.data || action.payload;
      const index = state.addresses.findIndex(
        (addr) => addr.id === updatedAddr.id,
      );

      if (index !== -1) {
        state.addresses[index] = updatedAddr;
      }
    });
  },
});

export const { setSelectedAddress } = addressSlice.actions;
export default addressSlice.reducer;
