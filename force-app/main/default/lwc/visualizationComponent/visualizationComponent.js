import { LightningElement, track } from 'lwc';
import ChartJS from '@salesforce/resourceUrl/ChartJS';
import { loadScript } from 'lightning/platformResourceLoader';
import {getVisualizationData, getVisualizationAbsoluteFactors} from 'c/visualizationData'

//w
const columnsWeightingFactors = [
    { label: 'Номер', fieldName: 'id'},
    { label: 'Критерій', fieldName: 'criterion' },
    { label: 'Експерт галузі', fieldName: 'industryExpert',  editable: true},
    { label: 'Експерт користування', fieldName: 'usabilityExpert',  editable: true },
    { label: 'Експерт програмування', fieldName: 'programingExpert',  editable: true },
    { label: 'Потенційні клієнти', fieldName: 'potentialCustomers',  editable: true },
    { label: 'Сума', fieldName: 'sum'},
    { label: 'Середнє значення', fieldName: 'average'}
];

//x
const columnsMarks = [
    { label: 'Номер', fieldName: 'id'},
    { label: 'Експерт галузі', fieldName: 'industryExpertMark',  editable: true},
    { label: 'Експерт користування', fieldName: 'usabilityExpertMark',  editable: true },
    { label: 'Експерт програмування', fieldName: 'programingExpertMark',  editable: true },
    { label: 'Потенційні клієнти', fieldName: 'potentialCustomersMark',  editable: true },
    { label: 'Сума', fieldName: 'sumMarks'},
    { label: 'Середнє значення', fieldName: 'averageMarks'}
];

//q
const columnsAbsoluteFactors = [
    { label: 'Номер', fieldName: 'id'},
    { label: 'Експерт', fieldName: 'expert'},
    { label: 'Абсолютий коефіцієнт вагомості', fieldName: 'absoluteFactor', editable: true},
    { label: 'Відносний коефіцієнт вагомості', fieldName: 'relativeFactor'},
];

const columnsComplex = [
    { label: 'Номер', fieldName: 'id'},
    { label: 'Критерій', fieldName: 'criterion' },
    { label: 'Експерт галузі(q)', fieldName: 'industryExpertComplex'},
    { label: 'Експерт користування(q)', fieldName: 'usabilityExpertComplex'},
    { label: 'Експерт програмування(q)', fieldName: 'programingExpertComplex'},
    { label: 'Потенційні клієнти(q)', fieldName: 'potentialCustomersComplex'},
    { label: 'Усереднене(Q)', fieldName: 'sum'},
    { label: 'X', fieldName: 'average'}
]

export default class VisualizationComponent extends LightningElement {
    @track columnsWeightingFactors = columnsWeightingFactors;
    @track columnsMarks = columnsMarks;
    @track columnsAbsoluteFactors = columnsAbsoluteFactors;
    @track columnsComplex = columnsComplex;
    @track data = [];
    @track dataExperts = [];
    @track chart = null;

    connectedCallback(){
        let data = getVisualizationData();

        this.data = data.map(d => {
            let newData = {
                id: d.id,
                criterion: d.criterion,
                industryExpert: Math.floor(Math.random() * 6) + 5,
                usabilityExpert: Math.floor(Math.random() * 6) + 5,
                programingExpert: Math.floor(Math.random() * 6) + 5,
                potentialCustomers: Math.floor(Math.random() * 6) + 5,
                industryExpertMark: Math.floor(Math.random() * 6) + 5,
                usabilityExpertMark: Math.floor(Math.random() * 6) + 5,
                programingExpertMark: Math.floor(Math.random() * 6) + 5,
                potentialCustomersMark: Math.floor(Math.random() * 6) + 5,
                sum: 0,
                average: 0,
                sumMarks: 0,
                averageMarks: 0
            }

            newData.sum = newData.industryExpert + newData.usabilityExpert + newData.programingExpert + newData.potentialCustomers;
            newData.average = newData.sum / 4;
            newData.sumMarks = newData.industryExpertMark + newData.usabilityExpertMark + newData.programingExpertMark + newData.potentialCustomersMark;
            newData.averageMarks = newData.sumMarks / 4;

            return newData;
        });

        data = getVisualizationAbsoluteFactors();

        this.dataExperts = data.map(d => {
            let newData = {
                id: d.id,
                expert: d.expert,
                absoluteFactor: Math.floor(Math.random() * 6) + 5,
                relativeFactor: 0
            }

            newData.relativeFactor = newData.absoluteFactor / 10;

            return newData
        });

        loadScript(this, ChartJS).then(() => {
            console.log('Success');
        });
    }

    get dataWeightingFactors(){
        return this.data.map(d => {
            return {
                id: d.id,
                criterion: d.criterion,
                industryExpert: d.industryExpert,
                usabilityExpert: d.usabilityExpert,
                programingExpert: d.programingExpert,
                potentialCustomers: d.potentialCustomers,
                sum: d.industryExpert + d.usabilityExpert + d.programingExpert + d.potentialCustomers,
                average: (d.industryExpert + d.usabilityExpert + d.programingExpert + d.potentialCustomers) / 4
            }
        });
    }

    get dataMarks(){
        return this.data.map(d => {
            return {
                id: d.id,
                industryExpertMark: d.industryExpertMark,
                usabilityExpertMark: d.usabilityExpertMark,
                programingExpertMark: d.programingExpertMark,
                potentialCustomersMark: d.potentialCustomersMark,
                sumMarks: d.industryExpertMark + d.usabilityExpertMark + d.programingExpertMark + d.potentialCustomersMark,
                averageMarks: (d.industryExpertMark + d.usabilityExpertMark + d.programingExpertMark + d.potentialCustomersMark) / 4
            }
        });
    }

    get dataAbsoluteFactors(){
        return this.dataExperts.map(d => {
            return {
                id: d.id,
                expert: d.expert,
                absoluteFactor: d.absoluteFactor,
                relativeFactor: d.absoluteFactor/10
            }
        });
    }

    get dataComplex(){
        let dataWeight = this.dataWeightingFactors;
        let dataMarks = this.dataMarks;
        let dataAbsolute = this.dataAbsoluteFactors;
        let newData = [];

        let sumOfAbsolute = dataAbsolute[0].relativeFactor + dataAbsolute[1].relativeFactor + dataAbsolute[2].relativeFactor + dataAbsolute[3].relativeFactor;

        for(let i = 0; i < dataMarks.length; i++){
            let d = {
                id: dataMarks[i].id,
                criterion: dataWeight[i].criterion,
                industryExpertComplex: parseFloat((dataWeight[i].industryExpert * dataMarks[i].industryExpertMark * dataAbsolute[0].relativeFactor).toFixed(2)),
                usabilityExpertComplex: parseFloat((dataWeight[i].usabilityExpert * dataMarks[i].usabilityExpertMark * dataAbsolute[1].relativeFactor).toFixed(2)),
                programingExpertComplex: parseFloat((dataWeight[i].programingExpert * dataMarks[i].programingExpertMark * dataAbsolute[2].relativeFactor).toFixed(2)),
                potentialCustomersComplex: parseFloat((dataWeight[i].potentialCustomers * dataMarks[i].potentialCustomersMark * dataAbsolute[3].relativeFactor).toFixed(2)),
                sum: 0,
                average: dataMarks[i].averageMarks
            }

            d.sum = parseFloat(((d.industryExpertComplex + d.usabilityExpertComplex + d.programingExpertComplex + d.potentialCustomersComplex)/sumOfAbsolute).toFixed(2));
            newData.push(d);
        }

        return newData;
    }

    get dataGeneralComplex(){
        let dataWeight = this.dataWeightingFactors;
        let dataMarks = this.dataMarks;
        let dataAbsolute = this.dataAbsoluteFactors;
        let sum = 0;
        let sumW = 0
        let general = {

        };

        for(let i = 0; i < dataMarks.length; i++){
            sum += dataMarks[i].industryExpertMark * dataWeight[0].industryExpert;
            sumW += dataWeight[0].industryExpert
        }
        sum *= dataAbsolute[0].relativeFactor
        sum /= sumW;
    }

    handleAbsoluteFactors(event){
        this.template.querySelector('[data-id="tableAbsolute"]').draftValues = [];
        let tempData = [...this.dataExperts];

        event.detail.draftValues.forEach(draftValue =>{
            this.data.forEach((value, index) => {
                if(value.id == draftValue.id){
                    if(draftValue.absoluteFactor != undefined) tempData[index].absoluteFactor = parseInt(draftValue.absoluteFactor);
                }
            })
        })

        this.dataExperts = tempData
    }

    handleMarks(event){
        this.template.querySelector('[data-id="tableMarks"]').draftValues = [];
        let tempData = [...this.data];

        event.detail.draftValues.forEach(draftValue =>{
            this.data.forEach((value, index) => {
                if(value.id == draftValue.id){
                    if(draftValue.industryExpertMark != undefined) tempData[index].industryExpertMark = parseInt(draftValue.industryExpertMark);
                    if(draftValue.usabilityExpertMark != undefined) tempData[index].usabilityExpertMark = parseInt(draftValue.usabilityExpertMark);
                    if(draftValue.potentialCustomersMark != undefined) tempData[index].potentialCustomersMark = parseInt(draftValue.potentialCustomersMark);
                    if(draftValue.programingExpertMark != undefined) tempData[index].programingExpertMark = parseInt(draftValue.programingExpertMark);
                }
            })
        })

        this.data = tempData
    }

    handleWeightingFactors(event){
        this.template.querySelector('[data-id="tableWeight"]').draftValues = [];
        let tempData = [...this.data];

        event.detail.draftValues.forEach(draftValue =>{
            this.data.forEach((value, index) => {
                if(value.id == draftValue.id){
                    if(draftValue.industryExpert != undefined) tempData[index].industryExpert = parseInt(draftValue.industryExpert);
                    if(draftValue.usabilityExpert != undefined) tempData[index].usabilityExpert = parseInt(draftValue.usabilityExpert);
                    if(draftValue.potentialCustomers != undefined) tempData[index].potentialCustomers = parseInt(draftValue.potentialCustomers);
                    if(draftValue.programingExpert != undefined) tempData[index].programingExpert = parseInt(draftValue.programingExpert);
                }
            })
        })

        this.data = tempData
    }

    handleDraw(event){
        let dataWeight = this.dataWeightingFactors;
        let dataComplex = this.dataComplex;
        let labels = dataWeight.map(d => d.criterion);
        let dataValues = [];

        if(event.target.label == 'Draw Industry') {
            dataValues = dataComplex.map(d => d.industryExpertComplex);
            this.isIndustry = true;
        }
        if(event.target.label == 'Draw Usability') {
            dataValues = dataComplex.map(d => d.usabilityExpertComplex);
        }
        if(event.target.label == 'Draw Programing') {
            dataValues = dataComplex.map(d => d.programingExpertComplex);
        }
        if(event.target.label == 'Draw Users') {
            dataValues = dataComplex.map(d => d.potentialCustomersComplex);
        }
        if(event.target.label == 'Draw General') {
            dataValues = dataComplex.map(d => d.sum);
        }

        let canvas = this.template.querySelector('canvas');

        const data = {
            labels: labels,
            datasets: [{
              label: 'Expert',
              data: dataValues,
              fill: true,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgb(255, 99, 132)',
              pointBackgroundColor: 'rgb(255, 99, 132)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgb(255, 99, 132)'
            },
            {
                data: [65, 0],
                fill: true,
                backgroundColor: 'rgba(54, 162, 235, 0)',
                borderColor: 'rgba(54, 162, 235, 0)',
                pointBackgroundColor: 'rgba(54, 162, 235, 0)',
                pointHoverBorderColor: 'rgba(54, 162, 235, 0)'
              }]
        };

        const config = {
            type: 'radar',
            data: data,
            options: {
                elements: {
                    line: {
                    borderWidth: 1
                    }
                },
            }
        };

        if(this.chart == null){
            this.chart = new Chart(canvas, config);
        }
        else{
            let i = 0;
            this.chart.data.datasets.forEach((dataset) => {
                if(i == 0){
                    dataset.data = dataValues;
                    i++;
                }
            });

            this.chart.update();
        }

    }
}
