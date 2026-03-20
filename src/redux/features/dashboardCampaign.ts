import { productAPI } from "@/services/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchDashboardCampaigns = createAsyncThunk(
  "campaign/fetchDashboardCampaigns",
  async (_: void, { rejectWithValue }: any) => {
    try {
      // productAPI.getDashboardCampaigns() already returns response.data (axios body)
      // So `response` here IS the API body: { data: [...campaigns] }
      const response = await productAPI.getDashboardCampaigns();
      console.log("API response body:", response);
      return response; // fulfilled handler extracts .data from this
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products",
      );
    }
  },
);


interface CampaignState {
  campaigns: any[];
  products: any[];
  isLoading: boolean;
  error: string | null;
}
const initialState: CampaignState = {
  campaigns: [],
  products: [],
  isLoading: false,
  error: null,
}

const formatProducts = (campaigns: any[]) => {
  return campaigns.flatMap((campaign) =>
    campaign.products.map((product) => {
      const variant = product.variants?.[0];

      return {
        id: product.id,
        name: product.name,
        brand: product.brand?.name,
        price: variant?.pricing?.selling_price,
        mrp: variant?.pricing?.mrp,
        image: variant?.images?.[0]?.image_url,
      };
    })
  );
};

const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDashboardCampaigns.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchDashboardCampaigns.fulfilled, (state, action) => {
      state.isLoading = false;
      // const campaigns = action.payload?.data || [];
      const campaigns = action.payload?.data || [];
      console.log(campaigns);
      state.campaigns = campaigns;
      state.products = formatProducts(campaigns);
      // console.log("Formatted Products 👉", formatProducts(campaigns));
    });
    builder.addCase(fetchDashboardCampaigns.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  }
})

export default campaignSlice.reducer;