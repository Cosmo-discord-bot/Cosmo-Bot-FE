import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicNowPlayingComponent } from './music-now-playing.component';

describe('MusicNowPlayingComponent', () => {
    let component: MusicNowPlayingComponent;
    let fixture: ComponentFixture<MusicNowPlayingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MusicNowPlayingComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MusicNowPlayingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
