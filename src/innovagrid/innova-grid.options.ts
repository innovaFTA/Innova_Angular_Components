import { Observable } from 'rxjs/Observable';
import { PipeTransform } from '@angular/core';


export class InnovaGridOptions {
    // public fields
    public DataSource: Observable<any>;
    public isLoading = false;
    public PrimaryFieldName: string;
    public Columns: InnovaGridColumn[];
    public CurrentDataLength: number;
    public UserPermissions: any[];
    public CheckBoxConditions?: Condition[];
    public PaginationFooterText: PaginationFooterText;
    public HeadIcon;
    //private Fields
    private Actions: InnovaGridActions[];
    private CondionalRowClasses?: ConditionalClass[];
    private Name = 'Default';
    private selectedPage: number;
    private EmptyMessage: string;

    public Initialize(page?: number) {
        if (page) {
            this.selectedPage = page;
        } else {
            this.selectedPage = 1;
        }
    }

    constructor(
        _name: string,
        _cols: InnovaGridColumn[],
        _actions?: InnovaGridActions[],
        _primaryFieldName?: string,
        _condionalRowClasses?: ConditionalClass[],
        _userPermissions?: any[],
        _checkBoxConditions?: Condition[],
        _emptyMessage?: string,
        _paginationFooterText?: PaginationFooterText) {
        this.Name = _name;
        this.Columns = _cols;
        this.Actions = _actions;
        this.PrimaryFieldName = _primaryFieldName;
        this.CondionalRowClasses = _condionalRowClasses;
        this.UserPermissions = _userPermissions;
        this.CheckBoxConditions = _checkBoxConditions;
        this.EmptyMessage = _emptyMessage != null ? _emptyMessage : "Herhangi bir kayıt bulunmamaktadır";
        this.PaginationFooterText = _paginationFooterText != null ? _paginationFooterText : { First: "İlk", Previous: "Önceki", Next: "Sonraki", Last: "Son" }
    }
}

export interface InnovaGridColumn {
    Header: string;
    DataField?: string;
    Width?: number;
    PipeElements?: PipeElement[];
}

export interface PipeElement {
    Pipe: PipeTransform;
    PipeParameters?: any[];
}

export interface ConditionalClass {
    Condition: Condition;
    Class: string;
}

export interface InnovaGridActions {
    ActionElementType: ActionElType;
    text?: string;
    DemandedDataFields?: string;
    CommandArg: string;
    imgSrc?: string;
    Class?: string;
    IconClass?: string;
    title?: string;
    ActionVisibilityConditions?: Condition[];
    constWidth?: string;
    permission?: string;
}

export enum ActionElType {
    button,
    img,
    link,
    icon
}

export interface Condition {
    DataField: string;
    ConditionValue: any;
    ConditionType: ConditionType;
    ExternalDataCheck?: boolean;
}

export enum ConditionType {
    Equal = 0,
    GraterThen = 1,
    GraterThenEqual = 2,
    SMallerThen = 3,
    SMallerThenEqual = 4,
    NotEqual = 5
}

export interface PaginationFooterText {
    First: string;
    Previous: string;
    Next: string;
    Last: string;
}