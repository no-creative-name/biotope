import * as styles from './styles.scss';

interface WikiTemplateData {

}

export default (render: Function, data: WikiTemplateData) => {
    return render`
        <style>${styles.toString()}</style>
        <div>Fill me</div>
    `;
}
