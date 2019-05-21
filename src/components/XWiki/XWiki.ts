import Component from '@biotope/element';
import template from './template';

import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';

interface XWikiProps {
    items
}

interface XWikiState {
    items: any
    liftId: string
}

enum LiftStatus {
    OPEN,
    CLOSED,
    HOLD
}

const client = new ApolloClient({
    uri: 'https://snowtooth.moonhighway.com/'
});

class XWiki extends Component<XWikiProps, XWikiState> {
    static componentName = 'x-wiki';

    private onEnterGet = (event) => {
        if(event.keyCode === 13) {
            event.preventDefault();
            this.state.liftId = event.target.value;
            this.getStatusForLiftId(this.state.liftId).then((data: any) => {
                this.setState({ items: [data.data.Lift] })
            })
        }
    }

    private onEnterSet = (event) => {
        const liftId = (<HTMLInputElement>this.shadowRoot.getElementById('liftIdForStatusSet')).value;
        
        let statusToSet;
        switch(event.target.innerHTML) {
            case 'open': statusToSet = 'OPEN'; break;
            case 'close': statusToSet = 'CLOSED'; break;
            case 'set on hold': statusToSet = 'HOLD'; break;
        }
        event.preventDefault();
        this.setStatusForLiftId(liftId, statusToSet).then(() => {
        }).then(() => {
            client.cache.reset();
            this.getStatusForAllLifts().then((data: any) => {
                this.setState({ items: data.data.allLifts })
            })
        })
    }

    private getStatusForAllLifts = () => {
        client.cache.reset();
        return client.query({
            query: gql`
                query {
                    allLifts {
                        name
                        status
                        capacity
                        id
                    }
                }`
        }).catch(error => {});
    }

    private getStatusForLiftId = (liftId: string) => {
        client.cache.reset();
        return client.query({
            query: gql`
                query {
                    Lift(id: "${liftId}") {
                        name
                        status
                        capacity
                    }
                }`
        }).catch(error => {return {data: { Lift: {name: liftId, status: 'not a lift that we know of.'}}}});
    }
    private setStatusForLiftId = (liftId: string, status: string) => {
        return client.mutate({
            mutation: gql`
                mutation {
                    setLiftStatus(id: "${liftId}", status: ${status}) {
                        name
                        status
                        capacity
                    }
                }`
        }).catch(error => {});
    }

    connectedCallback() {
        this.getStatusForAllLifts().then((data: any) => {
            this.setState({ items: data.data.allLifts })
        })
    }
    get defaultState() {
        return {
            items: [],
            liftId: 'jazz-cat'
        }
    }
    render() {
        const {
            items,
        } = this.props;

        const renderProps: XWikiProps = {
            items: this.state.items
        }

        return template(this.html, renderProps, this.onEnterGet, this.onEnterSet);
    }
}

export default XWiki;