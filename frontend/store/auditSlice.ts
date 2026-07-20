import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  PersistedAuditResultDto,
  PrimaryUseCase,
  ToolInputDto,
} from "@/types/audit.types";
import { INSTANT_PRESETS } from "@/constants/presets.constants";

interface AuditState {
  teamSize: number;
  primaryUseCase: PrimaryUseCase | string;
  tools: ToolInputDto[];
  auditResult: PersistedAuditResultDto | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuditState = {
  teamSize: 10,
  primaryUseCase: "coding",
  tools: [
    {
      toolName: "Cursor",
      plan: "Business",
      seats: 10,
      currentMonthlySpend: 400,
    },
  ],
  auditResult: null,
  loading: false,
  error: null,
};

const auditSlice = createSlice({
  name: "audit",
  initialState,
  reducers: {
    setTeamSize(state, action: PayloadAction<number>) {
      state.teamSize = action.payload;
      state.tools.forEach((tool) => {
        if (tool.seats > 0) {
          tool.seats = action.payload;
        }
      });
    },
    setPrimaryUseCase(state, action: PayloadAction<string>) {
      state.primaryUseCase = action.payload;
    },
    addTool(state, action: PayloadAction<ToolInputDto>) {
      state.tools.push(action.payload);
    },
    updateTool(
      state,
      action: PayloadAction<{ index: number; tool: ToolInputDto }>,
    ) {
      if (state.tools[action.payload.index]) {
        state.tools[action.payload.index] = action.payload.tool;
      }
    },
    hydrateFromStorage(
      state,
      action: PayloadAction<{
        teamSize: number;
        primaryUseCase: string;
        tools: ToolInputDto[];
      }>,
    ) {
      state.teamSize = action.payload.teamSize;
      state.primaryUseCase = action.payload.primaryUseCase;
      state.tools = action.payload.tools;
    },
    removeTool(state, action: PayloadAction<number>) {
      state.tools.splice(action.payload, 1);
    },
    applyPreset(state, action: PayloadAction<string>) {
      const preset = INSTANT_PRESETS.find((p) => p.id === action.payload);
      if (preset) {
        state.teamSize = preset.data.teamSize;
        state.primaryUseCase = preset.data.primaryUseCase;
        state.tools = preset.data.tools;
        state.error = null;
      }
    },
    setAuditResult(
      state,
      action: PayloadAction<PersistedAuditResultDto | null>,
    ) {
      state.auditResult = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    resetAuditState(state) {
      state.teamSize = initialState.teamSize;
      state.primaryUseCase = initialState.primaryUseCase;
      state.tools = [...initialState.tools];
      state.auditResult = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setTeamSize,
  setPrimaryUseCase,
  addTool,
  updateTool,
  hydrateFromStorage,
  removeTool,
  applyPreset,
  setAuditResult,
  setLoading,
  setError,
  resetAuditState,
} = auditSlice.actions;

export default auditSlice.reducer;
