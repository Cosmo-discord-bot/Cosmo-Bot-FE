import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicQueueComponent } from './music-queue.component';

describe('MusicQueueComponent', () => {
    let component: MusicQueueComponent;
    let fixture: ComponentFixture<MusicQueueComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MusicQueueComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MusicQueueComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
