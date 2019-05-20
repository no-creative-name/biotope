import Component from '@biotope/element';
import template from './template';

interface XWikiProps {

}

interface XWikiState {

}

class XWiki extends Component< XWikiProps, XWikiState > {
    static componentName = 'x-wiki';

    render() {
        return template(this.html, {});
    }
}

export default XWiki;
