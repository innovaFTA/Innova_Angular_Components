import { Component, Input, OnInit, DoCheck, Output, EventEmitter } from '@angular/core';


@Component({
    selector: 'innova-grid-paging',
    template: `
       <nav>
                    <ul class="pagination">
                           <li style="cursor:pointer" [class.disabled]="currentPage==1"
                         class="page-item">
                         <a class="page-link" (click)="onChange(1)">İlk</a>
                        </li>
                        <li style="cursor:pointer" [class.disabled]="currentPage==1" class="page-item">
                        <a class="page-link" (click)="onChange(currentPage-1)">Önceki</a>
                        </li>
                        <li style="cursor:pointer" *ngFor="let page of pages" [class.active]="currentPage==page"
                         class="page-item"><a class="page-link" (click)="onChange(page)">{{page}}</a>
                        </li>
                        <li style="cursor:pointer" [class.disabled]="currentPage==pages.length"
                         class="page-item">
                         <a class="page-link" (click)="onChange(currentPage+1)">Sonraki</a>
                        </li>
                           <li style="cursor:pointer" [class.disabled]="currentPage==pages.length"
                         class="page-item">
                         <a class="page-link" (click)="onChange(pages.length)">Son</a>
                        </li>
                    </ul>
                </nav>
    `
})

export class InnovaGridPagingComponent implements OnInit {
    @Input() currentPage: number;
    @Input() pageCount: number;

    @Output() onChangePage = new EventEmitter();

    pages: number[];

    constructor() { }

    private createPages() {
        this.pages = [];
        for (var i: number = 1; i <= this.pageCount; i++) {
            this.pages.push(i);
        }
    }

    onChange(page: number) {
        this.onChangePage.emit({ newPageIndex: page });
    }


    ngOnInit() {
        this.createPages();
    }



}