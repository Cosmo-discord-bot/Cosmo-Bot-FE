// store/actions/guild.actions.ts
import { createAction, props } from '@ngrx/store';

export const selectGuild = createAction('[Guild] Select Guild', props<{ guildId: string }>());
