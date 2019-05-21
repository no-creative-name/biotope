import * as styles from './styles.scss';

interface XWikiTemplateData {
    items: any
}

export default (render: Function, data: XWikiTemplateData, onEnterGet: Function, onEnterSet: Function) => {
    return render`
        <style>${styles.toString()}</style>
        <h2>Lift Status</h2>
        <div>
            ${data.items.map(item => {
                return `<div class="statusContainer"><div class="status ${item.status.toLowerCase()}"></div><h3>${item.name} has a capacity of ${item.capacity}.</h3></div>`
            })}
        </div>
        <select id="liftIdForStatusSet">
            ${data.items.map(item => {
                return `<option value="${item.id}">${item.name}</option>`
            })}
        </select>
        <a onclick=${onEnterSet}>open</a>
        <a onclick=${onEnterSet}>close</a>
        <a onclick=${onEnterSet}>set on hold</a>
    `;
}