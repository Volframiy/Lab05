import { LightningElement, track } from 'lwc';
import {getDataForIdentification, getDataForIdentificationAction} from 'c/analysisData'

const columns = [
    { label: 'Ризик', fieldName: 'risk' },
    { label: 'Значення', fieldName: 'value'}
];

const columnsAction = [
    { label: 'Подія', fieldName: 'action' },
    { label: 'Значення', fieldName: 'value'}
];

export default class AnalysisIdentification extends LightningElement {
    @track probability = {t: 0.0, c: 0.0, p: 0.0, m: 0.0}
    data = [];
    columns = columns;

    @track probabilityAction = {t: 0.0, c: 0.0, p: 0.0, m: 0.0}
    dataAction = []
    columnsAction = columnsAction;

    connectedCallback() {
        let i = 0;

        this.data = getDataForIdentification();
        this.dataAction = getDataForIdentificationAction();

        this.data.forEach((d) => {
            if(i < 7) this.probability.t += parseInt(d.value)/18.0;
            if(i > 6 && i < 10) this.probability.c += parseInt(d.value)/18.0;
            if(i > 9 && i < 13) this.probability.p += parseInt(d.value)/18.0;
            if(i > 12) this.probability.m += parseInt(d.value)/18.0;
            i++;
        })

        i = 0;

        this.dataAction.forEach((d) => {
            if(i < 11) this.probabilityAction.t += parseInt(d.value)/47.0;
            if(i > 10 && i < 20) this.probabilityAction.c += parseInt(d.value)/47.0;
            if(i > 19 && i < 31) this.probabilityAction.p += parseInt(d.value)/47.0;
            if(i > 30) this.probabilityAction.m += parseInt(d.value)/47.0;
            i++;
        })
    }

    get getProbability() {
        return {
            t: this.probability.t.toFixed(2),
            c: this.probability.c.toFixed(2),
            p: this.probability.p.toFixed(2),
            m: this.probability.m.toFixed(2),
            total : (this.probability.t + this.probability.c + this.probability.p + this.probability.m).toFixed(2)
        }
    }

    get getProbabilityAction() {
        return {
            t: this.probabilityAction.t.toFixed(2),
            c: this.probabilityAction.c.toFixed(2),
            p: this.probabilityAction.p.toFixed(2),
            m: this.probabilityAction.m.toFixed(2),
            total : (this.probabilityAction.t + this.probabilityAction.c + this.probabilityAction.p + this.probabilityAction.m).toFixed(2)
        }
    }
}