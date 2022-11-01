import { LightningElement } from 'lwc';
import {getDataForIdentificationAction} from 'c/analysisData'

const columns = [
    { label: 'Номер', fieldName: 'num'},
    { label: 'Подія', fieldName: 'action' },
    { label: 'Рішення', fieldName: 'solution' }
];

export default class AnalysisPlanning extends LightningElement {
    data = [];
    columns = columns;

    connectedCallback(){
        let data = getDataForIdentificationAction();
        this.data = data.map(d => {
            if(d.solution == undefined) return {num: d.num,
                action: d.action,
                solution: [{
                    label: 'Рішення',
                    expanded: false
                }]}

            let sentences = d.solution.split(';');

            return {
                num: d.num,
                action: d.action,
                solution: [{
                    label: 'Рішення',
                    expanded: false,
                    items: sentences.map(s => { return { label: s}})
                }]
            }
        });
    }
}