import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscordCallbackComponent } from './discord-callback.component';

describe('DiscordCallbackComponent', () => {
    let component: DiscordCallbackComponent;
    let fixture: ComponentFixture<DiscordCallbackComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DiscordCallbackComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DiscordCallbackComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
