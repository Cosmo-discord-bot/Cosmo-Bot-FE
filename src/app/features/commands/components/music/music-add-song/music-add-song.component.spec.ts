import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicAddSongComponent } from './music-add-song.component';

describe('MusicAddSongComponent', () => {
    let component: MusicAddSongComponent;
    let fixture: ComponentFixture<MusicAddSongComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MusicAddSongComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MusicAddSongComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
