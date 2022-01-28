import { Component, Input, OnInit, Output, EventEmitter, DoCheck, ChangeDetectionStrategy } from '@angular/core';

import { InnovaGridOptions, Condition, ConditionType, ConditionalClass } from './innova-grid.options';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';

@Component({
    selector: 'innova-grid',
    templateUrl: 'innova-grid.template.html'
})

export class InnovaGridComponent implements OnInit, DoCheck {
    // Input properties
    @Input() Options: InnovaGridOptions;
    @Input() AllowPaging = false;
    @Input() PageSize: number;
    @Input() StaticPaging = true;
    @Input() PageCount: number;
    @Input() RowCount: number;
    @Input() AllowCheckBox: boolean;
    @Input() HeadIcon: string;
    @Input() HeaderAllowCheckBox: boolean;

    // Private properties for only component
    ErrorOnProcess = false;
    fault: string;
    Datas: ModifiedData[] = [];
    TempDatas: ModifiedData[] = [];

    loading: boolean;
    dataLength = 0;
    startIndex = 0;
    isDataChecked = false;
    idDataChecked: number;
    isPageChanged: boolean = false;

    private oldDataSource: any = null;

    // Events
    @Output() OnButtonclick = new EventEmitter();
    @Output() OnPageIndexChanged = new EventEmitter();
    @Output() OnCheckBoxChanged = new EventEmitter();
    @Output() OnAllCheckBoxChanged = new EventEmitter();

    constructor() { }

    ngOnInit() {
        // Eğer Options yok ise hata veriyoruz. zorunlu
        if (this.Options) {
            // Columns eğer yaratılmadı ise option içinde hata veriyoruz
            if (!this.Options.Columns) {
                this.fault = 'Grid not has any Options.Columns';
                console.error(this.fault);
                this.ErrorOnProcess = true;
            }

            // allow paging kontrolü eğer seçilirse size lazım
            if (this.AllowPaging && !this.PageSize) {
                this.fault = 'Paging is active, Please give a [PageSize] to Grid!';
                console.error(this.fault);
                this.ErrorOnProcess = true;
            }

            this.Options.Initialize();
        }

        
    }

    ngDoCheck() {
        if(this.Options){
            if (this.Options.DataSource && this.oldDataSource !== this.Options.DataSource) {
                this.createTableWithData();
                this.oldDataSource = this.Options.DataSource;
            }
    
            if (this.Options.DataSource && this.isPageChanged) {
                this.Datas.forEach(x => {
                    if (!this.TempDatas.find(y => y.DataId === x.DataId)) {
                        this.TempDatas.push(x);
                    }
                });
            }
        }
    }

    private createTableWithData() {
        this.TempDatas = [];
        this.Datas = [];
        this.Options.DataSource.map(x => {
            let obj = this.Options.Columns
                .filter(x => x.DataField != null)
                .map(a => {
                    let navs: string[] = a.DataField.split('.');
                    let elm: DataELement = null;
                    if (navs.length === 1) {
                        elm = new DataELement(a.DataField, x[navs[0]]);
                    }
                    else {
                        let navElement: any = null;
                        navElement = x;
                        navs.forEach(nav => {
                            navElement = navElement[nav];
                        });
                        elm = new DataELement(a.DataField, navElement);
                    }
                    if (a.PipeElements && a.PipeElements.length > 0) {
                        a.PipeElements.forEach(pipe => {
                            elm.value = pipe.Pipe.transform(elm.value, pipe.PipeParameters);
                        });
                    }
                    return elm;
                });
            if (obj) {
                this.Datas.push({
                    DataId: x[this.Options.PrimaryFieldName],
                    DataElements: obj,
                    IsChecked: (((this.idDataChecked == undefined) || (this.TempDatas.find(x => x.DataId == this.idDataChecked) == undefined)) && !this.isPageChanged)
                        ? null
                        : (this.idDataChecked == undefined && this.isPageChanged && (this.TempDatas.find(y => y.DataId == x[this.Options.PrimaryFieldName]) == undefined))
                            ? null
                            : (this.idDataChecked == undefined && this.isPageChanged && (this.TempDatas.find(y => y.DataId == x[this.Options.PrimaryFieldName]) != undefined))
                                ? (this.TempDatas.find(y => y.DataId == x[this.Options.PrimaryFieldName]).IsChecked)
                                : this.idDataChecked != undefined && (x[this.Options.PrimaryFieldName] == this.idDataChecked
                                    ? (this.TempDatas.find(x => x.DataId == this.idDataChecked).IsChecked)
                                    : (this.TempDatas.find(y => y.DataId == x[this.Options.PrimaryFieldName]).IsChecked))
                });
            }
        });
        this.dataLength = this.Datas.length;
        this.Options.CurrentDataLength = this.Datas.length;
        if (this.RowCount != null) {
            this.PageCount = ((this.RowCount < this.PageSize)) ? 1 : ((this.RowCount % this.PageSize) == 0 && (this.RowCount >= this.PageSize)) ? (this.RowCount / this.PageSize) : (Math.floor(this.RowCount / this.PageSize) + 1);
        }
        // this.Datas = _.take(_.rest(this.Datas,this.startIndex), this.PageSize);
    }

    // method of grid

    public changePage(args: any) {
        if (this.AllowPaging && this.StaticPaging) {
            this.Options.Initialize(args.newPageIndex);
            this.OnPageIndexChanged.emit({ newPageIndex: args.newPageIndex });
        }
        if (this.AllowCheckBox) {
            this.isPageChanged = true;
            this.idDataChecked = undefined;
        }
    }

    public handleChange(args) {
        this.isDataChecked = args.target.checked;
        this.idDataChecked = args.target.value;
        if (!this.isPageChanged && !this.TempDatas.find(y => y.DataId == this.idDataChecked)) {
            this.TempDatas = this.Datas;
        }

        this.TempDatas.filter(x => x.DataId == this.idDataChecked).map(x => x.IsChecked = this.isDataChecked);
        this.isPageChanged = false;

        this.OnCheckBoxChanged.emit({ checkedState: args.target.checked, checkedValue: args.target.value, checkedList: this.TempDatas.filter(x => x.IsChecked) });
    }
    public checkChange(id) {
  
        this.idDataChecked = id;
     
  }

  onallcheckBoxChanged(args) {


       this.isDataChecked = args.isDataChecked;
    
           this.TempDatas = this.Datas;
    
    
        if( this.isDataChecked==true){ 
        this.TempDatas.forEach(element => {
      
            element.IsChecked=true;
            this.checkChange(element.DataId);
            
        });
       
    }else{
        this.TempDatas.forEach(element => {
    
            element.IsChecked=false;
        });
       
    }
          
       this.OnAllCheckBoxChanged.emit({checkedState:  this.isDataChecked, checkedValue: "1", checkedList: this.TempDatas.filter(x => x.IsChecked) });
   
      }
    // event of grid
    onClick(_commandArg: string, _rowId: number, _demandedDataFields: string = null) {
        let _extraFields: any = {};
        let mData: ModifiedData = null;

        if (_demandedDataFields) {
            mData = this.Datas.find(x => x.DataId === _rowId);
            let fields = _demandedDataFields.split(',');

            fields.forEach(x => {
                _extraFields[x] = mData.DataElements.find(a => a.key === x).value;
            });
        }

        this.OnButtonclick.emit({ Value: _rowId, Command: _commandArg, ExtraFields: _extraFields });
    }

    // check condtion for action OnButtonclick
    // tslint:disable-next-line:member-ordering
    public CheckCondition(mData: ModifiedData, Conditions?: Condition[]): boolean {
        let results: boolean[] = [];
        if (Conditions) {
            if (Conditions.length > 0) {
                Conditions.forEach(x => {
                    let dataValue;

                    if (!x.ExternalDataCheck) {
                        dataValue = mData.DataElements.find(a => a.key === x.DataField).value;
                    }
                    else {

                        let selectedData = this.Options.DataSource.filter(a => a.Id == mData.DataId)[0];

                        let navs: string[] = x.DataField.split('.');
                        if (navs.length === 1) {
                            dataValue = selectedData[x.DataField];
                        }
                        else {
                            navs.forEach(nav => {
                                selectedData = selectedData[nav];
                            });
                            dataValue = selectedData;
                        }
                    }

                    switch (x.ConditionType) {
                        case ConditionType.Equal:
                            if (dataValue === x.ConditionValue) {
                                results.push(true);
                            }
                            break;
                        case ConditionType.GraterThen:
                            if (dataValue > x.ConditionValue) {
                                results.push(true);
                            }
                            break;
                        case ConditionType.GraterThenEqual:
                            if (dataValue >= x.ConditionValue) {
                                results.push(true);
                            }
                            break;
                        case ConditionType.SMallerThen:
                            if (dataValue < x.ConditionValue) {
                                results.push(true);
                            }
                            break;
                        case ConditionType.SMallerThenEqual:
                            if (dataValue <= x.ConditionValue) {
                                results.push(true);
                            }
                        case ConditionType.NotEqual:
                            if (dataValue <= x.ConditionValue) {
                                results.push(true);
                            }
                            break;
                    }
                });
            }
        }

        if (Conditions != null && Conditions.length !== results.length) {
            return false;
        }
        else {
            return true;
        }
    }

    public ApplyRowClassWithConditions(datas: DataELement[], conditionalClass: ConditionalClass[]): string {
        let resp = '';
        if (conditionalClass) {
            if (conditionalClass.length > 0) {
                conditionalClass.forEach(x => {
                    switch (x.Condition.ConditionType) {
                        case ConditionType.Equal:
                            if (datas.find(a => a.key === x.Condition.DataField).value === x.Condition.ConditionValue) {
                                resp = x.Class;
                            }
                            break;
                        case ConditionType.GraterThen:
                            if (datas.find(a => a.key === x.Condition.DataField).value > x.Condition.ConditionValue) {
                                resp = x.Class;
                            }
                            break;
                        case ConditionType.GraterThenEqual:
                            if (datas.find(a => a.key === x.Condition.DataField).value >= x.Condition.ConditionValue) {
                                resp = x.Class;
                            }
                            break;
                        case ConditionType.SMallerThen:
                            if (datas.find(a => a.key === x.Condition.DataField).value < x.Condition.ConditionValue) {
                                resp = x.Class;
                            }
                            break;
                        case ConditionType.SMallerThenEqual:
                            if (datas.find(a => a.key === x.Condition.DataField).value <= x.Condition.ConditionValue) {
                                resp = x.Class;
                            }
                            break;
                        default:
                            resp = x.Class;
                            break;
                    }
                });
            }
        }

        return resp;
    }

    hasPermission(permission) {
        if (permission && this.Options.UserPermissions) {
            return this.Options.UserPermissions.find(item => item.PermissionCode.toLowerCase().trim() === permission.toLowerCase().trim()) != null;
        }
        return true;
    }
}

// Grid oluşturmak için gerekli dataları içerecek
export class ModifiedData {
    DataId: number;
    DataElements: DataELement[];
    IsChecked?: boolean = false;
}

export class DataELement {
    value: string;
    key: string;
    constructor(_key: string, _value: string) {
        this.key = _key;
        this.value = _value;
    }
}