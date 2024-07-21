import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GuildState } from '../reducers/guild.reducer';

export const selectGuildState = createFeatureSelector<GuildState>('guild');

export const selectSelectedGuildId = createSelector(selectGuildState, (state: GuildState) => state?.selectedGuildId ?? null);
