import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddControlPage } from './add-control.page';

describe('AddControlPage', () => {
  let component: AddControlPage;
  let fixture: ComponentFixture<AddControlPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddControlPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddControlPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
