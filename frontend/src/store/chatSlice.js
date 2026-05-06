import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    sessions: [],
    currentSessionId: null,
    messages: [],
    loading: false,
  },
  reducers: {
    setSessions: (state, action) => {
      state.sessions = action.payload;
    },
    setCurrentSession: (state, action) => {
      state.currentSessionId = action.payload.session_id;
      state.messages = action.payload.messages || [];
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});

export const { setSessions, setCurrentSession, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
