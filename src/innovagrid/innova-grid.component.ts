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

    // Private properties for only component
    ErrorOnProcess = false;
    fault: string;
    Datas: ModifiedData[] = [];
    loading: boolean;
    dataLength = 0;
    startIndex = 0;

    // Events
    @Output() OnButtonclick = new EventEmitter();
    @Output() OnPageIndexChanged = new EventEmitter();

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
        }

        this.Options.Initialize();
    }

    ngDoCheck() {
        if (this.Options.DataSource) {
            this.createTableWithData();
        }
    }

    private createTableWithData() {
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
                    DataElements: obj
                });
            }
        });
        this.dataLength = this.Datas.length;
        this.Options.CurrentDataLength = this.Datas.length;
        // this.Datas = _.take(_.rest(this.Datas,this.startIndex), this.PageSize);
    }

    // method of grid

    public changePage(args:any) {
        if (this.AllowPaging && this.StaticPaging) {
            this.Options.Initialize(args.newPageIndex);
            this.OnPageIndexChanged.emit({ newPageIndex: args.newPageIndex });
        }
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
    public CheckCondition(datas: DataELement[], Conditions?: Condition[]): boolean {
        let result = true;
        if (Conditions) {
            result = false;
            if (Conditions.length > 0) {
                Conditions.forEach(x => {
                    switch (x.ConditionType) {
                        case ConditionType.Equal:
                            if (datas.find(a => a.key === x.DataField).value === x.ConditionValue) {
                                result = true;
                            }
                            break;
                        case ConditionType.GraterThen:
                            if (datas.find(a => a.key === x.DataField).value > x.ConditionValue) {
                                result = true;
                            }
                            break;
                        case ConditionType.GraterThenEqual:
                            if (datas.find(a => a.key === x.DataField).value >= x.ConditionValue) {
                                result = true;
                            }
                            break;
                        case ConditionType.SMallerThen:
                            if (datas.find(a => a.key === x.DataField).value < x.ConditionValue) {
                                result = true;
                            }
                            break;
                        case ConditionType.SMallerThenEqual:
                            if (datas.find(a => a.key === x.DataField).value <= x.ConditionValue) {
                                result = true;
                            }
                            break;
                    }
                });
            }
        }

        return result;
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
}

// Grid oluşturmak için gerekli dataları içerecek
export class ModifiedData {
    DataId: number;
    DataElements: DataELement[];
}

export class DataELement {
    value: string;
    key: string;
    constructor(_key: string, _value: string) {
        this.key = _key;
        this.value = _value;
    }
}