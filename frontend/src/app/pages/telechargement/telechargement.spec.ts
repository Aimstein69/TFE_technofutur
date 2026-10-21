import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Telechargement } from './telechargement';

describe('Telechargement', () => {
  let component: Telechargement;
  let fixture: ComponentFixture<Telechargement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Telechargement],
    }).compileComponents();

    fixture = TestBed.createComponent(Telechargement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
