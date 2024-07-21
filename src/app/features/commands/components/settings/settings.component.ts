import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { CommandsService } from '../../services/commands.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { selectSelectedGuildId } from '@selectors/guild.selectors';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
    configForm: FormGroup;
    guildId: string | null = null;
    private guildSubscription: Subscription | null = null;

    constructor(
        private fb: FormBuilder,
        private store: Store,
        private commandsService: CommandsService,
        private snackBar: MatSnackBar
    ) {
        this.configForm = this.fb.group({
            mainChannelId: ['', [Validators.required]],
            rolesChannelId: ['', [Validators.required]],
            eventsGroupId: ['', [Validators.required]],
        });
    }

    ngOnInit() {
        this.guildSubscription = this.store.select(selectSelectedGuildId).subscribe((guildId) => {
            if (guildId && guildId !== this.guildId) {
                this.guildId = guildId;
                this.loadConfig(guildId);
            }
        });
    }

    loadConfig(guildId: string) {
        this.commandsService.getConfig(guildId).subscribe({
            next: (config) => {
                this.configForm.patchValue(config);
            },
            error: (error) => {
                console.error('Error fetching config:', error);
                this.snackBar.open('Error fetching configuration', 'Close', { duration: 3000 });
            },
        });
    }

    onSubmit() {
        if (this.configForm.valid && this.guildId) {
            const formValue = this.configForm.value;
            formValue.guildId = this.guildId;
            console.log('Submitting config:', formValue);
            this.commandsService.updateConfig(this.guildId, formValue).subscribe({
                next: (response) => {
                    console.log('Config updated:', response);
                    this.snackBar.open('Configuration updated successfully', 'Close', { duration: 3000 });
                },
                error: (error) => {
                    console.error('Error updating config:', error);
                    this.snackBar.open('Error updating configuration', 'Close', { duration: 3000 });
                },
            });
        }
    }

    ngOnDestroy() {
        if (this.guildSubscription) {
            this.guildSubscription.unsubscribe();
        }
    }
}
