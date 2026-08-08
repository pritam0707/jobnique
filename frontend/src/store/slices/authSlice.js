import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// Register User Thunk
export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/register", data);
      
      // Store token if returned in response body
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

// Login User Thunk
export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", data);
      
      // Store token if returned in response body
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// Fetch Current User / Session Restore Thunk
export const fetchCurrentUser = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    // 🛑 GUARD: Check if token exists before firing API request
    const token = localStorage.getItem("token");

    if (!token) {
      return rejectWithValue("No authentication token found");
    }

    try {
      const res = await api.get("/auth/me");
      return res.data.user;
    } catch (err) {
      // If token is invalid or expired, clean up local storage
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
      }
      return rejectWithValue(err.response?.data?.message || "Failed to fetch user");
    }
  }
);

// Toggle Save/Unsave Job Thunk
export const toggleSaveJob = createAsyncThunk(
  "auth/toggleSaveJob",
  async (jobId, { rejectWithValue }) => {
    try {
      // Strips accidental quotes or spaces from incoming ID string
      const cleanJobId = String(jobId).replace(/^["']|["']$/g, "").trim();

      const res = await api.post(`/jobs/save/${cleanJobId}`);

      // Returns populated savedJobs array directly from backend controller
      return res.data.savedJobs;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to toggle bookmark");
    }
  }
);

// Logout Thunk
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  try {
    await api.get("/auth/logout");
  } catch (err) {
    console.warn("Logout endpoint warning:", err.message);
  } finally {
    // Always clear token from storage on logout
    localStorage.removeItem("token");
  }
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    isInitializing: true, // Prevents route flickering on browser refresh
    error: null,
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register Cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login Cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Current User Cases
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isInitializing = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.isInitializing = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Toggle Save Job Cases (Instant updates to state.user.savedJobs)
      .addCase(toggleSaveJob.fulfilled, (state, action) => {
        if (state.user) {
          state.user.savedJobs = action.payload;
        }
      })
      .addCase(toggleSaveJob.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Logout Cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;