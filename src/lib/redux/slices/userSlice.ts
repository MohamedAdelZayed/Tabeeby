import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "@/src/lib/supabaseClient";
import { UserType } from "@/src/lib/types";

interface userState {
  data: UserType | null;
  loading: boolean;
  error: string | null;
}

// thunk لجلب بيانات المستخدم من Supabase
export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();


      if (userError) throw userError;
      if (!user) throw new Error("No authenticated user");

      const { data: userData, error } = await supabase
        .from("users")
        .select("*")
        .eq("auth_id", user.id)
        .single();


      if (error) throw error;

      return userData;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState: userState = {
  data: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
  
    clearUser(state) {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  
    updateUser(state, action: PayloadAction<Partial<UserType>>) {
      if (state.data) {
        state.data = { ...state.data, ...action.payload };
      }
    },
    

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<UserType>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUser , updateUser } = userSlice.actions;
export default userSlice.reducer;