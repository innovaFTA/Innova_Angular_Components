import { Injectable } from '@angular/core';

@Injectable()
export class InnovaTestService {
    getTestString(): string {
        return 'test it';
    }
}