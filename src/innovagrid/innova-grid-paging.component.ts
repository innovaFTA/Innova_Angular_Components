import { Component, Input, OnInit, DoCheck, Output, EventEmitter, ViewChild, Inject, forwardRef } from '@angular/core';
import { first } from 'rxjs/operator/first';
import { InnovaGridComponent } from './innova-grid.component'

@Component({
    selector: 'innova-grid-paging',
    template: `
         <nav>
                    <ul class="pagination">
                           <li style="cursor:pointer" [class.disabled]="currentPage==1"
                         class="page-item">
                         <a class="page-link" (click)="onChange(1)">{{parent.Options.PaginationFooterText.First}}</a>
                        </li>
                        <li style="cursor:pointer" [class.disabled]="currentPage==1" class="page-item">
                        <a class="page-link" (click)="onChange(currentPage-1)">{{parent.Options.PaginationFooterText.Previous}}</a>
                        </li>
                        <li style="cursor:pointer" class="hidden" *ngIf ="firstHidden" class="page-item">
                        <a class="page-link" >...</a>
                        </li>
                        <li style="cursor:pointer" *ngFor="let page of pages" [class.active]="currentPage==page"
                         class="page-item"><a class="page-link" (click)="onChange(page)">{{page}}</a>
                        </li>
                        <li style="cursor:pointer" class="hidden" *ngIf ="lastHidden" class="page-item">
                        <a class="page-link" >...</a>
                        </li>
                        <li style="cursor:pointer" [class.disabled]="currentPage==totalCount"
                         class="page-item">
                         <a class="page-link" (click)="onChange(currentPage+1)">{{parent.Options.PaginationFooterText.Next}}</a>
                        </li>
                           <li style="cursor:pointer" [class.disabled]="currentPage==totalCount"
                         class="page-item">
                         <a class="page-link" (click)="onChange(totalCount)">{{parent.Options.PaginationFooterText.Last}}</a>
                        </li>
                    </ul>
                </nav>
    `
})

export class InnovaGridPagingComponent implements OnInit {
    @Input() currentPage: number;
    @Input() pageCount: number;
    @Input() paginationRange: number;
    @Output() onChangePage = new EventEmitter();

    pages: number[];
    firstHidden : boolean;
    lastHidden : boolean;
    totalCount:number;
    constructor( @Inject(forwardRef(() => InnovaGridComponent)) public parent: InnovaGridComponent) {
    }

    private createPages() {
       
        this.pages = [];
        this.totalCount = this.pageCount;
     
      //  let pageDisplayRange =7;
        let endPoint =0;
        let startPoint = 0;
        if(this.currentPage<=this.paginationRange)
        {    
            startPoint=1;        
            this.firstHidden=false;
            if(this.totalCount > this.paginationRange * 2)
            {
                endPoint = this.paginationRange * 2;
                this.lastHidden=true;
            }
            else 
            {
                endPoint = this.totalCount;
                this.lastHidden=false;
            }
        }
        else 
        {
            startPoint = this.currentPage-this.paginationRange;
            if(startPoint==1)
            this.firstHidden=false;
            else
            this.firstHidden=true;
            if(this.totalCount > this.paginationRange + this.currentPage)
            {
                this.lastHidden=true;
                endPoint = this.paginationRange + this.currentPage;
            }
            else{
                endPoint = this.totalCount;
                this.lastHidden=false;
                startPoint = this.totalCount -  this.paginationRange * 2
            }                        
        }
        
        for (var i: number = startPoint; i <= endPoint; i++) {
            this.pages.push(i);
        }
    }

    onChange(page: number) {
        this.onChangePage.emit({ newPageIndex: page });
    }


    // ngDoCheck() {
    //     if (this.parent.RowCount && this.pageCount) {
    //         this.createPages();
    //     }
    // }

    ngOnInit() {
        this.createPages();
    }
}