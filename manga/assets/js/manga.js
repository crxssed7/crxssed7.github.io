import { generateDate } from "./helpers/generateDate.js";

export class Manga {
    dateStatuses = ["READING", "COMPLETED", "PAUSED"];
    SCORES = {
        1: "Horrific",
        2: "Bad",
        3: "Bad",
        4: "Bad",
        5: "Meh",
        6: "Meh",
        7: "Good",
        8: "Good",
        9: "Amazing",
        10: "Terrific"
    }

    constructor(data, status, favourite) {
        this.data = data
        this.status = status
        this.favourite = favourite
        this.setName()
        this.setProgressAndMaximum()
        this.setColor()
        this.setImages()
        this.setScore()
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

    setScore() {
        this.score = this.data["score"] === 0 ? null : this.data["score"];
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

    appendIcon(icon, container) {
        container.appendChild(icon.cloneNode(false));
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

        // Is this favourited?
        var favourited = this.emptyElement("div");
        if (this.favourite === true) {
            favourited = this.generateIcon("bi-star-fill", "Favourite");
        }

        // Is this being collected?
        var coll = this.emptyElement("div");
        if (this.isCollecting() === true) {
            coll = this.generateIcon("bi-bookmark-check-fill", "Collecting");
        }

        var scoreIcon = this.emptyElement("div");
        if (this.score !== null) {
            scoreIcon = this.generateIcon(`bi-${this.score}-square-fill`, this.SCORES[this.score]);
        }

        const icons = [favourited, coll, scoreIcon];

        const link = this.emptyElement("a");
        link.classList.add("entry-link");
        link.href = `https://reviews.crxssed.dev/manga/${this.data.media.id}`

        const outerDiv = this.emptyElement("div");
        outerDiv.classList.add("entry");
        outerDiv.style = `border-color: ${this.color}; background-image: url(${this.bannerImage}); background-color: ${this.color};`
        link.appendChild(outerDiv);

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
        detailDiv.appendChild(justifiedDiv);

        const iconDivMobile = this.emptyElement("div");
        iconDivMobile.classList.add("d-flex");
        iconDivMobile.classList.add("d-sm-flex");
        iconDivMobile.classList.add("d-md-none");
        iconDivMobile.classList.add("d-lg-none");
        iconDivMobile.classList.add("icons");
        icons.forEach((i) => this.appendIcon(i, iconDivMobile))
        detailDiv.appendChild(iconDivMobile);

        const iconDivDesktop = this.emptyElement("div");
        iconDivDesktop.classList.add("d-none");
        iconDivDesktop.classList.add("d-sm-none");
        iconDivDesktop.classList.add("d-md-flex");
        iconDivDesktop.classList.add("d-lg-flex");
        iconDivDesktop.classList.add("icons");
        icons.forEach((i) => this.appendIcon(i, iconDivDesktop))
        justifiedDiv.appendChild(iconDivDesktop);

        return link;
    }
}
