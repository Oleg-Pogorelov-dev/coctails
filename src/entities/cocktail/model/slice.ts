import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Cocktail } from './types';
import type { CocktailCode } from './consts';

type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

type CocktailsState = {
  byCode: Record<CocktailCode, { items: Cocktail[]; status: Status; error?: string } | undefined>;
};

const initialState: CocktailsState = {
  byCode: {
    margarita: undefined,
    mojito: undefined,
    a1: undefined,
    kir: undefined,
  },
};

export const fetchCocktailsByCode = createAsyncThunk<
  { code: CocktailCode; items: Cocktail[] },
  CocktailCode,
  { rejectValue: { code: CocktailCode; message: string } }
>(
  'cocktails/fetchByCode',
  async (code, { rejectWithValue }) => {
    try {
      const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${code}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { drinks: Cocktail[] | null };
      return { code, items: data.drinks ?? [] };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return rejectWithValue({ code, message });
    }
  },
);

const cocktailsSlice = createSlice({
  name: 'cocktails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCocktailsByCode.pending, (state, action) => {
        const code = action.meta.arg as CocktailCode;
        state.byCode[code] = { items: [], status: 'loading' };
      })
      .addCase(
        fetchCocktailsByCode.fulfilled,
        (state, action: PayloadAction<{ code: CocktailCode; items: Cocktail[] }>) => {
          const { code, items } = action.payload;
          state.byCode[code] = { items, status: 'succeeded' };
        },
      )
      .addCase(fetchCocktailsByCode.rejected, (state, action) => {
        const code = (action.meta.arg ?? 'margarita') as CocktailCode;
        const message = (action.payload as any)?.message ?? action.error.message ?? 'Error';
        state.byCode[code] = { items: [], status: 'failed', error: message };
      });
  },
});

export default cocktailsSlice.reducer;
export type { CocktailsState };


