
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "@/src/lib/supabaseClient";
import { AppointmentType } from "@/src/lib/types";

interface AppointmentsState {
  data: AppointmentType[];
  loading: boolean;
  error: string | null;
}

// thunk لجلب المواعيد
export const fetchAppointments = createAsyncThunk(
  "appointments/fetchAppointments", async (_, { rejectWithValue }) => {

    try {

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return [];

      const { data, error } = await supabase
       .from("appointments")
       .select(`
          id,
          appointment_date,
          appointment_time,
          fees,
          specialty,
          doctor_id,
          doctor_name,
          doctor_Image,
          is_paid,
          patient:patient_id (
            id,
            name,
            image,
            birthday
          )
        `)
        .order("appointment_date", { ascending: false })
        .order("appointment_time", { ascending: false });


      if (error) throw error;
    
      return data || [];
    
    } catch (err: any) {
    
        return rejectWithValue(err.message);
    
    }
  
}
);

const initialState: AppointmentsState = {
  data: [],
  loading: false,
  error: null,
};

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  
  reducers: {
    addAppointment(state, action: PayloadAction<AppointmentType>) {
      state.data.unshift(action.payload);
    },
    removeAppointment(state, action: PayloadAction<number>) {
      state.data = state.data.filter(a => a.id !== action.payload);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action: PayloadAction<AppointmentType[]>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addAppointment , removeAppointment } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;
