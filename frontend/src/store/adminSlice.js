import { createSlice } from '@reduxjs/toolkit';

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    stats: { usersCount: 0, docsCount: 0, queriesCount: 0 },
    logs: [],
    members: [],
  },
  reducers: {
    setStats: (state, action) => { state.stats = action.payload; },
    setLogs: (state, action) => { state.logs = action.payload; },
    setMembers: (state, action) => { state.members = action.payload; },
  },
});

export const { setStats, setLogs, setMembers } = adminSlice.actions;
export default adminSlice.reducer;
