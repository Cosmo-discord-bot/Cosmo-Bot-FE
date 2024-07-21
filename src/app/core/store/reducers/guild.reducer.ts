import { createReducer, on } from '@ngrx/store';
import * as GuildActions from '../actions/guild.actions';

export interface GuildState {
    selectedGuildId: string | null;
}

export const initialState: GuildState = {
    selectedGuildId: null,
};

export const guildReducer = createReducer(
    initialState,
    on(GuildActions.selectGuild, (state, { guildId }) => ({
        ...state,
        selectedGuildId: guildId,
    }))
);
