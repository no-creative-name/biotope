import * as styles from './styles.scss';

interface XWikiTemplateData {

}

export default (render: Function, data: XWikiTemplateData) => {
    return render`
        <style>${styles.toString()}</style>
        <div>Fill me</div>
    `;
}
