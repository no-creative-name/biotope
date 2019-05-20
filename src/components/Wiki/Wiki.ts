import Component from '@biotope/element';
import template from './template';

interface WikiProps {

}

interface WikiState {

}

class Wiki extends Component< WikiProps, WikiState > {
    static componentName = 'wiki';

    render() {
        return template(this.html, {});
    }
}

export default Wiki;
