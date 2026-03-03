import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/src/lib/supabaseClient";
import { SpecialtyType } from "../../types";


interface SpecialtiesState {
  data: SpecialtyType[];
  loading: boolean;
  error: string | null;
}

const initialState: SpecialtiesState = {
  data: [],
  loading: false,
  error: null,
};

// Fetch Specialties
export const fetchSpecialties = createAsyncThunk(
  "specialties/fetchSpecialties",
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("specialties")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      return rejectWithValue(error.message);
    }

    return data;
  }
);

const specialtiesSlice = createSlice({
  name: "specialties",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpecialties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpecialties.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload as SpecialtyType[];
      })
      .addCase(fetchSpecialties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default specialtiesSlice.reducer;