import Component from '@biotope/element';
import template from './template';

import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

interface XLiftInfoState {
    lifts: Lift[];
    selectedLiftId: string;
}

export interface Lift {
    name: string;
    status: string;
    capacity: number;
    id: string;
}

const cache = new InMemoryCache();

const client = new ApolloClient({
    uri: 'https://snowtooth.moonhighway.com/',
    cache
});

class XLiftInfo extends Component<{}, XLiftInfoState> {
    static componentName = 'x-lift-info';

    private onEnterSet = (event) => {
        const liftId = (<HTMLInputElement>this.shadowRoot.getElementById('liftSelection__select')).value;
        this.setState({selectedLiftId: liftId});

        let statusToSet;
        switch(event.target.innerHTML) {
            case 'open': statusToSet = 'OPEN'; break;
            case 'close': statusToSet = 'CLOSED'; break;
            case 'set on hold': statusToSet = 'HOLD'; break;
        }

        this.setStatusForLiftId(liftId, statusToSet)
    }

    private showLiftInfo = (event) => {
        if(this.state.lifts[0].capacity == undefined) {
            this.getCapacityForAllLifts();
        }
        event.target.getElementsByClassName('status__card')[0].classList.add('show');
    }

    private hideLiftInfo = (event) => {
        event.target.getElementsByClassName('status__card')[0].classList.remove('show');
    }

    private getDataForAllLifts = () => {
        return client.query({
            query: gql`
                query {
                    allLifts {
                        name
                        status
                        id
                    }
                }`
        }).then((data: any) => {
            this.setState({ lifts: data.data.allLifts })
        }).catch(error => console.error(error));
    }

    private getCapacityForAllLifts = () => {
        return client.query({
            query: gql`
                query {
                    allLifts {
                        id
                        capacity
                    }
                }`
        }).then((data: any) => {
            this.getFullDataForAllLifts();
        }).catch(error => console.error(error));
    }

    private getFullDataForAllLifts = () => {
        const liftData = client.readQuery({
            query: gql`
                query {
                    allLifts {
                        name
                        status
                        id
                        capacity
                    }
                }`
        });
        this.setState({ lifts: liftData.allLifts })
    }

    private setStatusForLiftId = (liftId: string, status: string) => {
        return client.mutate({
            mutation: gql`
                mutation {
                    setLiftStatus(id: "${liftId}", status: ${status}) {
                        name
                        status
                        id
                    }
                }`
        }).then(() => {
            this.getDataForAllLifts()
        }).catch(error => console.error(error));
    }

    connectedCallback() {
        this.getDataForAllLifts();
    }
    
    get defaultState() {
        return {
            lifts: [],
            selectedLiftId: ''
        }
    }

    render() {
        return template(this.html, this.state, this.onEnterSet, this.showLiftInfo, this.hideLiftInfo);
    }
}

export default XLiftInfo;