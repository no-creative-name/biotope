import * as styles from './styles.scss';

interface XWikiTemplateData {
    items: any
}

export default (render: Function, data: XWikiTemplateData) => {
    return render`
        <style>${styles.toString()}</style>
        <div>
        <div>
          ${data.items.map(item => {
               return `<h1>${item.id}</h1> `
            })}
        </div>
    `;
}