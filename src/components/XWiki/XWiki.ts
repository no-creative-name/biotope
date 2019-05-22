import Component from '@biotope/element';
import template from './template';

import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

interface XWikiProps {
    lifts: Lift[]
}

interface XWikiState {
    lifts: Lift[]
}

interface Lift {
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

class XWiki extends Component<XWikiProps, XWikiState> {
    static componentName = 'x-wiki';

    private onEnterSet = (event) => {
        const liftId = (<HTMLInputElement>this.shadowRoot.getElementById('liftSelection__select')).value;
        
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
            this.getCapacityForAllLifts()
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
        }).catch(error => {});
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
        }).catch(error => {});
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
        console.log(this.state);
        
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
        }).catch(error => {});
    }

    connectedCallback() {
        this.getDataForAllLifts();
    }
    get defaultState() {
        return {
            lifts: []
        }
    }
    render() {
        const {
            lifts,
        } = this.props;

        const renderProps: XWikiProps = {
            lifts: this.state.lifts
        }

        return template(this.html, renderProps, this.onEnterSet, this.showLiftInfo, this.hideLiftInfo);
    }
}

export default XWiki;