import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertyComponent } from './property.component';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PropertyService } from '../../services/property.service';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';

describe('PropertyComponent', () => {
  let component: PropertyComponent;
  let fixture: ComponentFixture<PropertyComponent>;
  let propertyService: jasmine.SpyObj<PropertyService>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const propertyServiceSpy = jasmine.createSpyObj('PropertyService', ['getProperty', 'addProperty']);
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers']);

    await TestBed.configureTestingModule({
      declarations: [PropertyComponent],
      imports: [FormsModule, HttpClientTestingModule],
      providers: [
        { provide: PropertyService, useValue: propertyServiceSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();

    propertyService = TestBed.inject(PropertyService) as jasmine.SpyObj<PropertyService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getProperty on init', () => {
    expect(propertyService.getProperty).toHaveBeenCalled();
  });

  it('should call getUsers on init', () => {
    expect(userService.getUsers).toHaveBeenCalled();
  });
});
