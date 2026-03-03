
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "@/src/lib/supabaseClient";
import { doctorType } from "@/src/lib/types";

interface doctorsState {
  data: doctorType[];
  loading: boolean;
  error: string | null;
}

// thunk لجلب الدكاتره
export const fetchDoctors = createAsyncThunk(
  "doctors/fetchDoctors", async (_, { rejectWithValue }) => {

    try {

      const { data, error } = await supabase
        .from("doctors")
        .select("*")


      if (error) throw error;
    
      return data || [];
    
    } catch (err: any) {
    
        return rejectWithValue(err.message);
    
    }
  
}
);

const initialState: doctorsState = {
  data: [],
  loading: false,
  error: null,
};

const doctorsSlice = createSlice({
  name: "doctors",
  initialState,
  
  reducers: {
    addDoctor(state, action: PayloadAction<doctorType>) {
      state.data.unshift(action.payload);
    },
    // removeAppointment(state, action: PayloadAction<number>) {
    //   state.data = state.data.filter(a => a.id !== action.payload);
    // },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action: PayloadAction<doctorType[]>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },

});

export const { addDoctor } = doctorsSlice.actions;
export default doctorsSlice.reducer;
