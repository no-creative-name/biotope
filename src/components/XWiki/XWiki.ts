import Component from '@biotope/element';
import template from './template';

interface XWikiProps {
    items
}

interface XWikiState {
    items: any
}

const query = `
    query {
        allLifts {
        id
        }
    }
`;

const url = "https://snowtooth.moonhighway.com/";
const opts = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query })
};


 function returnJson() {
    return fetch(url, opts)
    .then(res => res.json());
}

class XWiki extends Component< XWikiProps, XWikiState > {
    static componentName = 'x-wiki';

    connectedCallback() {
        returnJson().then(data => {
            this.setState({items: data.data.allLifts})
        })
    }
    get defaultState() {
        return{
            items: []
        }
    }
    render() {

        const {
            items,
          } = this.props;
        
    const renderProps: XWikiProps = {
        items:  this.state.items
    }

    return template(this.html, renderProps);
    }
}

export default XWiki;