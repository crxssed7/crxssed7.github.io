import { stripSafe } from "./helpers/stripSafe.js";
import { generateDate } from "./helpers/generateDate.js";

export class Manga {
    dateStatuses = ["READING", "COMPLETED", "PAUSED"];

    constructor(data, status) {
        this.data = data
        this.status = status
        this.setName()
        this.setProgressAndMaximum()
        this.setColor()
        this.setImages()
    }

    isCollecting() {
        return this.data['customLists']['Collecting']
    }

    setProgressAndMaximum() {
        this.progress = Number(this.data['progress']);
        var chapters = this.data['media']['chapters'];
        this.max = Number(chapters);
        if (this.max > 0) {
            this.percentage = ((this.progress / this.max) * 100).toFixed(0)
        } else {
            this.percentage = undefined
        }
    }

    setColor() {
        var color = this.data['media']['coverImage']['color'];
        if (color === null || color === undefined) {
            color = '#a0a0a0';
        }
        this.color = color;
    }

    setName() {
        var mangaName = this.data['media']['title']['english']
        if (mangaName === null || mangaName === undefined) {
            mangaName = this.data['media']['title']['romaji'];
        }
        this.name = mangaName;
    }

    setImages() {
        this.coverImage = this.data['media']['coverImage']['medium']
        this.bannerImage = this.data['media']['bannerImage']
    }

    dateString(field, type) {
        var date = this.data[field];
        var dateString = "";
        if (date['year']) {
            var d = generateDate(Number(date['year']), Number(date['month']), Number(date['day']));
            dateString = `${type}: ${d}`
        }
        return dateString;
    }

    generateDateHtml() {
        var output = "";
        switch (this.status) {
            case "READING":
                output = this.dateString("startedAt", "Started");
            break;
            
            case "PAUSED":
                output = this.dateString("startedAt", "Started");
            break;

            case "COMPLETED":
                output = this.dateString("completedAt", "Completed");
            break;
        }

        const pTag = document.createElement("p");
        pTag.style = "margin-bottom: 0px;";
        const smallTag = document.createElement("small");
        smallTag.innerText = output;
        pTag.appendChild(smallTag);

        return pTag;
    }

    generateFractionHtml() {
        const pTag = this.emptyElement();
        pTag.style = "margin-bottom: 0px;";
        const smallTag = document.createElement("small");
        if (this.max === 0) {
            smallTag.innerText = `${this.progress} / ?`
        } else {
            smallTag.innerText = `${this.progress} / ${this.max} (${this.percentage}%)`
        }
        pTag.appendChild(smallTag);

        return pTag;
    }

    generateIcon(icon, title) {
        const iTag = document.createElement("i");
        iTag.classList.add("bi");
        iTag.classList.add(icon);
        iTag.title = title;
        return iTag;
    }

    emptyElement(tag = "p") {
        return document.createElement(tag)
    }

    toHtml() {
        // Build Date String
        var dateHtml = this.emptyElement("div");
        if (this.dateStatuses.includes(this.status.toUpperCase())) {
            dateHtml = this.generateDateHtml();
        }
    
        // Build Fraction String
        const fractionHtml = this.generateFractionHtml();

        // Is this being collected?
        var coll = this.emptyElement("div");
        if (this.isCollecting() === true) {
            coll = this.generateIcon("bi-bookmark-check-fill", "Collecting");
        }
        
        const outerDiv = this.emptyElement("div");
        outerDiv.classList.add("entry");
        outerDiv.style = `border-color: ${this.color}; background-image: url(${this.bannerImage}); background-color: ${this.color};`
        const notes = this.data['notes'];
        if (notes !== null) {
            outerDiv.setAttribute("data-bs-toggle", "tooltip");
            outerDiv.setAttribute("data-bs-placement", "bottom");
            outerDiv.setAttribute("data-bs-title", stripSafe(notes));
        }

        const innerDiv = this.emptyElement("div");
        innerDiv.classList.add("flex");
        innerDiv.classList.add("entry-bg-img");
        outerDiv.appendChild(innerDiv);

        const coverImage = this.emptyElement("div");
        coverImage.classList.add("entry-img");
        coverImage.style = `background-image: url('${this.coverImage}');`;
        innerDiv.appendChild(coverImage);

        const contentDiv = this.emptyElement("div");
        contentDiv.classList.add("entry-content");
        innerDiv.appendChild(contentDiv);

        const entryName = this.emptyElement("h5");
        entryName.classList.add("entry-name");
        entryName.innerText = this.name;
        contentDiv.appendChild(entryName);

        const detailDiv = this.emptyElement("div");
        detailDiv.appendChild(dateHtml);
        contentDiv.appendChild(detailDiv);

        const justifiedDiv = this.emptyElement("div");
        justifiedDiv.classList.add("d-flex");
        justifiedDiv.classList.add("justify-content-between");
        justifiedDiv.appendChild(fractionHtml);
        justifiedDiv.appendChild(coll);
        detailDiv.appendChild(justifiedDiv);

        return outerDiv;
    }
}
