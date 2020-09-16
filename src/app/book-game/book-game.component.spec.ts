import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookGameComponent } from './book-game.component';

describe('BookGameComponent', () => {
  let component: BookGameComponent;
  let fixture: ComponentFixture<BookGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
