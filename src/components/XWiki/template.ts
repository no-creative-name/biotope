import * as styles from './styles.scss';
import Component from '@biotope/element';

interface XWikiTemplateData {
    lifts: any
}

const createLiftInfo = (data, showLiftInfo, hideLiftInfo) => {
    const map = data.lifts.map(lift => {
        const statusClass = `status__indicator ${lift.status.toLowerCase()}`;
        return Component.wire()`<a class="status" data-lift-id="${lift.id}" onmouseover=${showLiftInfo} onmouseleave=${hideLiftInfo}>
            <div class="${statusClass}"></div>
            <h3>${lift.name}</h3>
            <div class="status__card">Capacity ${lift.capacity}</div>
        </a>`
    });
    
    return map;
}

export default (render: Function, data: XWikiTemplateData, onEnterSet: Function, showLiftInfo: Function, hideLiftInfo: Function) => {
    return render`
        <style>${styles.toString()}</style>
        <div class="container">
            <div class="statusInfo">
                ${createLiftInfo(data, showLiftInfo, hideLiftInfo)}
            </div>
            <div class="liftSelection">
                <select id="liftSelection__select">
                    ${data.lifts.map(lift => {
                        return `<option value="${lift.id}">${lift.name}</option>`
                    })}
                </select>
                <a onclick=${onEnterSet}>open</a>
                <a onclick=${onEnterSet}>close</a>
                <a onclick=${onEnterSet}>set on hold</a>
            </div>
        </div>
    `;
}