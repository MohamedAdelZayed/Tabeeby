import { configureStore } from "@reduxjs/toolkit";
import appointmentsReducer from "./slices/appointmentsSlice";
import doctorsReducer from "./slices/doctorsSlice";
import userReducer from './slices/userSlice'
import specialtiesReducer from './slices/specialitiesSlice'
import themeReducer from './slices/themeSlice'

export const store = configureStore({
  reducer: {
    appointments: appointmentsReducer,
    doctors: doctorsReducer,
    user: userReducer,
    specialties: specialtiesReducer,
    theme: themeReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
