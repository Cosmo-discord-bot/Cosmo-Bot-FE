import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { SettingsService } from '../../services/settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { selectSelectedGuildId } from '@selectors/guild.selectors';

interface Channel {
    channelId: string;
    name: string;
    type: string;
}

interface Role {
    id: string;
    name: string;
}

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
    configForm: FormGroup;
    channels: Channel[] = [];
    textChannels: Channel[] = [];
    groupChannels: Channel[] = [];
    guildRoles: Role[] = [];
    guildId: string | null = null;
    private guildSubscription: Subscription | null = null;

    constructor(
        private fb: FormBuilder,
        private store: Store,
        private settingsService: SettingsService,
        private snackBar: MatSnackBar
    ) {
        this.configForm = this.fb.group({
            mainChannelId: ['', [Validators.required]],
            rolesChannelId: ['', [Validators.required]],
            eventsGroupId: ['', [Validators.required]],
            djRoles: [[]],
            RBACRoles: [[]],
            channels: this.fb.array([]),
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
        this.settingsService.getConfig(guildId).subscribe({
            next: (config) => {
                this.configForm.patchValue({
                    ...config,
                    djRoles: config.djRoles || [],
                    RBACRoles: config.RBACRoles || [],
                });
                this.channels = config.allChannels;
                this.textChannels = config.textChannels;
                this.groupChannels = config.groupChannels;
                this.guildRoles = config.guildRoles;
                this.configForm.get('channels')?.setValue(config.allChannels.map((channel: Channel) => channel.channelId));
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
            const submitConfig = {
                ...formValue,
                guildId: this.guildId,
            };
            console.log('Submitting config:', submitConfig);
            this.settingsService.updateConfig(this.guildId, submitConfig).subscribe({
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
