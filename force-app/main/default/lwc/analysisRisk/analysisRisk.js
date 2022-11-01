import { LightningElement, track } from 'lwc';
import {getDataForIdentificationAction} from 'c/analysisData'

const columns = [
    { label: 'Номер', fieldName: 'num'},
    { label: 'Подія', fieldName: 'action' },
    { label: 'Оцінка 1', fieldName: 'mark1',  editable: true},
    { label: 'Оцінка 2', fieldName: 'mark2',  editable: true },
    { label: 'Оцінка 3', fieldName: 'mark3',  editable: true },
    { label: 'Оцінка 4', fieldName: 'mark4',  editable: true },
    { label: 'Оцінка 5', fieldName: 'mark5',  editable: true },
    { label: 'Оцінка 6', fieldName: 'mark6',  editable: true },
    { label: 'Оцінка 7', fieldName: 'mark7',  editable: true },
    { label: 'Оцінка 8', fieldName: 'mark8',  editable: true },
    { label: 'Оцінка 9', fieldName: 'mark9',  editable: true },
    { label: 'Оцінка 10', fieldName: 'mark10',  editable: true },
    { label: 'ER', fieldName: 'average' }
];

const columnsQuantity = [
    { label: 'Номер', fieldName: 'num'},
    { label: 'Подія', fieldName: 'action' },
    { label: 'ER', fieldName: 'er' },
    { label: 'LRER', fieldName: 'lrer',  editable: true},
    { label: 'VRER', fieldName: 'vrer' },
    { label: 'Пріоретит', fieldName: 'priority' }
];

export default class AnalysisRisk extends LightningElement {
    @track data = [];
    columns = columns;

    @track dataQuantity = [];
    columnsQuantity = columnsQuantity;
    rowOffset = 0

    connectedCallback(){
        let data = getDataForIdentificationAction();
        let maxVRER = -1;
        let minVRER = 1;

        this.data = data.map(element => {
            let newElement = {
                num : element.num,
                action: element.action,
                mark1: parseFloat(Math.random().toFixed(2)),
                mark2: parseFloat(Math.random().toFixed(2)),
                mark3: parseFloat(Math.random().toFixed(2)),
                mark4: parseFloat(Math.random().toFixed(2)),
                mark5: parseFloat(Math.random().toFixed(2)),
                mark6: parseFloat(Math.random().toFixed(2)),
                mark7: parseFloat(Math.random().toFixed(2)),
                mark8: parseFloat(Math.random().toFixed(2)),
                mark9: parseFloat(Math.random().toFixed(2)),
                mark10: parseFloat(Math.random().toFixed(2)),
                average: 0.0
            }

            newElement.average = parseFloat(((newElement.mark1 + newElement.mark2 + newElement.mark3 
                + newElement.mark4 + newElement.mark5 + newElement.mark6 + newElement.mark7 
                + newElement.mark8 + newElement.mark9 + newElement.mark10)/ 10.0).toFixed(2));

            return newElement;
        })

        this.dataQuantity = this.data.map(d =>{
            let newElement = {
                num: d.num,
                action: d.action,
                er: d.average,
                lrer: parseFloat(Math.random().toFixed(2)),
                vrer: 0
            }

            newElement.vrer = parseFloat((newElement.er * newElement.lrer).toFixed(2));

            return newElement;
        })

        this.dataQuantity.forEach(d => {
            if(d.vrer > maxVRER) maxVRER = d.vrer;
            if(d.vrer < minVRER) minVRER = d.vrer;
        })

        let mpr = (maxVRER - minVRER) / 3;

        this.dataQuantity = this.dataQuantity.map(d => {
            let priority = 'Low';
            if(d.vrer >= minVRER + mpr && d.vrer < minVRER + 2*mpr) priority = 'Medium';
            if(d.vrer >= minVRER + 2*mpr) priority = 'High';

            return {
                ...d,
                priority: priority
            }
        })
    }

    handleSaveLRER(event){
        this.template.querySelector("lightning-datatable").draftValues = [];
        let temData = [...this.dataQuantity];

        event.detail.draftValues.forEach(draftValue =>{
            this.dataQuantity.forEach((value, index, array) => {
                if(value.num == draftValue.num){
                    console.log(JSON.stringify(draftValue));
                    if(draftValue.lrer != undefined) temData[index].lrer = parseFloat(draftValue.lrer);
                }
            })
        })

        this.dataQuantity = temData;
    }

    handleSaveMark(event){
        this.template.querySelector("lightning-datatable").draftValues = [];
        let temData = [...this.data];

        event.detail.draftValues.forEach(draftValue =>{
            this.data.forEach((value, index, array) => {
                if(value.num == draftValue.num){
                    if(draftValue.mark1 != undefined) temData[index].mark1 = parseFloat(draftValue.mark1);
                    if(draftValue.mark2 != undefined) temData[index].mark2 = parseFloat(draftValue.mark2);
                    if(draftValue.mark3 != undefined) temData[index].mark3 = parseFloat(draftValue.mark3);
                    if(draftValue.mark4 != undefined) temData[index].mark4 = parseFloat(draftValue.mark4);
                    if(draftValue.mark5 != undefined) temData[index].mark5 = parseFloat(draftValue.mark5);
                    if(draftValue.mark6 != undefined) temData[index].mark6 = parseFloat(draftValue.mark6);
                    if(draftValue.mark7 != undefined) temData[index].mark7 = parseFloat(draftValue.mark7);
                    if(draftValue.mark8 != undefined) temData[index].mark8 = parseFloat(draftValue.mark8);
                    if(draftValue.mark9 != undefined) temData[index].mark9 = parseFloat(draftValue.mark9);
                    if(draftValue.mark10 != undefined) temData[index].mark10 = parseFloat(draftValue.mark10);
                }
            })
        })

        this.data = temData;
    }

    get getData(){
        let data = this.data.map(element => {
            let newElement = {
                ...element
            }

            newElement.average = parseFloat(((newElement.mark1 + newElement.mark2 + newElement.mark3 
                + newElement.mark4 + newElement.mark5 + newElement.mark6 + newElement.mark7 
                + newElement.mark8 + newElement.mark9 + newElement.mark10)/ 10.0).toFixed(2));

            return newElement;
        })

        return data;
    }

    get getDataQuantity(){
        let maxVRER = -1;
        let minVRER = 1;
        let i = 0;

        let dataQuantity = this.getData.map(d =>{
            let newElement = {
                num: d.num,
                action: d.action,
                er: d.average,
                lrer: this.dataQuantity[i].lrer,
                vrer: 0
            }

            newElement.vrer = parseFloat((newElement.er * newElement.lrer).toFixed(2));
            i++;

            return newElement;
        })

        dataQuantity.forEach(d => {
            if(d.vrer > maxVRER) maxVRER = d.vrer;
            if(d.vrer < minVRER) minVRER = d.vrer;
        })

        let mpr = (maxVRER - minVRER) / 3;

        dataQuantity = dataQuantity.map(d => {
            let priority = 'Low';
            if(d.vrer >= minVRER + mpr && d.vrer < minVRER + 2*mpr) priority = 'Medium';
            if(d.vrer >= minVRER + 2*mpr) priority = 'High';

            return {
                ...d,
                priority: priority
            }
        })

        return dataQuantity;
    }

    get getIntervls(){
        let maxVRER = -1;
        let minVRER = 1;

        this.getDataQuantity.forEach(d => {
            if(d.vrer > maxVRER) maxVRER = d.vrer;
            if(d.vrer < minVRER) minVRER = d.vrer;
        })

        let mpr = parseFloat(((maxVRER - minVRER) / 3).toFixed(2));
        maxVRER = parseFloat((maxVRER).toFixed(2))
        minVRER = parseFloat((minVRER).toFixed(2))

        return {
            min : minVRER.toFixed(2),
            max: maxVRER.toFixed(2),
            interval1: `Low: [${minVRER}:${minVRER + mpr})`,
            interval2: `Medium: [${minVRER + mpr}:${minVRER + 2*mpr})`,
            interval3: `High: [${minVRER + 2*mpr}:${maxVRER})`,
        }
    }
}