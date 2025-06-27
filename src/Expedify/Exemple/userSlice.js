import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk pour l'inscription
export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData, thunkAPI) => {
    try {
      const endpoint = 'http://localhost:8000/api/signup';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessages = data.errors
          ? Object.values(data.errors).flat().join(', ')
          : data.message || 'Erreur lors de l\'inscription';
        throw new Error(errorMessages);
      }

      if (data.token) {
        document.cookie = `token=${data.token}; path=/; max-age=86400`;
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Thunk fictif pour connexion (à implémenter si besoin)
export const loginUser = createAsyncThunk(
  'users/loginUser',
  async (loginData, thunkAPI) => {
    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessages = data.errors
          ? Object.values(data.errors).flat().join(', ')
          : data.message || 'Erreur lors de la connexion';
        throw new Error(errorMessages);
      }

      if (data.token) {
        document.cookie = `token=${data.token}; path=/; max-age=86400`;
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    status: 'idle',
    error: null,
    message: null,
    currentUser: null,
    userType: null,
  },
  reducers: {
    resetAuthState: (state) => {
      state.status = 'idle';
      state.error = null;
      state.message = null;
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.userType = null;
      state.status = 'idle';
      state.error = null;
      state.message = null;
      document.cookie = 'token=; path=/; max-age=0';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.message = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload.message || "Inscription réussie";
        state.currentUser = action.payload.user || action.payload.company;
        state.userType = action.payload.user?.type || action.payload.company?.type || null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.message = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload.message || "Connexion réussie";
        state.currentUser = action.payload.user || action.payload.company;
        state.userType = action.payload.user?.type || action.payload.company?.type || null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetAuthState, logoutUser } = userSlice.actions;
export default userSlice.reducer;
