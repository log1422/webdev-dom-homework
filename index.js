"use strict"


export const comments = {
    data: [],
    remoteURI: "https://wedev-api.sky.pro/api/v1/@log1422/comments",

    addRecord(name, comment, quoteID = "") {
        const isMine = (name === "@log1422")
        const count = new Date().getTime()

        this.data.push({
            id: count,
            name: name,
            date: new Date().print(),
            quoteID: quoteID,
            comment: comment,
            marks: 0,
            isLiked: false,
            isMine: isMine,
        })
    },

    deleteLast() {
        this.data.pop()
    },

    updateLikeStatus(id) {
        const record = this.data[id]

        if (record.isLiked) {
            record.isLiked = false
            record.marks -= 1
        } else {
            record.isLiked = true
            record.marks += 1
        }
    },

    printQuote(id, toElement) {
        const record = this.data[id]

        toElement.innerHTML = record.comment
        return `${record.name}, `
    },

    printListItems() {
        return this.data.map((record, index) => {
            const commentCl = `comment${record.isMine ? " comment--mine" : ""}`
            const buttonCl = `like-button${record.isLiked ? " like-button--active" : ""}`
            const dataId = `data-id="${index}"`

            const printQuote = () => {
                if (!record.quoteID)
                    return ""

                const quote = this.data[record.quoteID]
                const dataId = `data-quoteid="${record.quoteID}"`

                return `<div class="comment-text comment-quote" ${dataId}>
                    ${quote.comment}
                </div>`
            }

            return `<li class="${commentCl}" ${dataId}>
                <div class="comment-header">
                    <div>${record.name}</div>
                    <div>${record.date}</div>
                </div>
                <div class="comment-body">
                    ${printQuote()}
                    <div class="comment-text">
                        ${record.comment}
                    </div>
                </div>
                <div class="comment-footer">
                    <div class="likes">
                        <span class="likes-counter">${record.marks}</span>
                        <button class="${buttonCl}" ${dataId}></button>
                    </div>
                </div>
            </li>`
        }).join('')
    },

    getCommentsFromServer(doRender, changeLoading) {
        fetch(this.remoteURI)
            .then((response) => response.json())
            .then((data) => {
                this.data = data.comments.map((record) => {
                    return {
                        id: record.id,
                        name: record.author.name,
                        date: record.date,
                        quoteID: "",
                        comment: record.text,
                        marks: record.likes,
                        isLiked: record.isLiked,
                        isMine: (record.author.name === "@log1422"),
                    }
                })

                changeLoading(false)

                doRender()
            })
            .catch((error) => handleError(error, changeLoading))
    },

    sendCommentToServer(name, comment, doRender, changeLoading) {
        const params = {
            method: "POST",
            body: JSON.stringify({
                name: name,
                text: comment,
            })
        }
        let statusCode = 0

        fetch(this.remoteURI, params)
            .then((response) => {
                statusCode = response.status

                return response.json()
            })
            .then((data) => {
                if (statusCode === 400)
                    throw new Error(data.error)

                this.getCommentsFromServer(doRender, changeLoading)
            })
            .catch((error) => handleError(error, changeLoading))
    },
}


function handleError(error, changeLoading) {
    alert(error)

    changeLoading(false)
}


function zeroPad(num, places) {
    return String(num).padStart(places, "0")
}

Date.prototype.print = (date = null, withSeconds = false) => {
    if (date === null)
        date = new Date()
    else if (typeof date === "string")
        date = new Date(date)

    const parts = []
    parts.push(zeroPad(date.getDate(), 2))
    parts.push(".")
    parts.push(zeroPad(date.getMonth() + 1, 2))
    parts.push(".")
    parts.push(date.getFullYear().toString().substring(2))
    parts.push(" ")
    parts.push(zeroPad(date.getHours(), 2))
    parts.push(":")
    parts.push(zeroPad(date.getMinutes(), 2))

    if (withSeconds) {
        parts.push(":")
        parts.push(zeroPad(date.getSeconds(), 2))
    }

    return parts.join("")
}

String.prototype.sterilize = function () {
    return this
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll("/", "&sol;")
}


{
    const root = document.querySelector(":root")
    const lstComments = document.getElementById("comment-list")
    const txtName = document.getElementById("name-input")
    const txtQuote = document.getElementById("quote-input")
    const txtComment = document.getElementById("comment-input")
    const boxQuote = document.getElementById("quote-box")
    const lblQuote = document.getElementById("quote-text")
    const btnCancelQ = document.getElementById("quote-cancel")
    const btnSubmit = document.getElementById("comment-add")
    const btnRemove = document.getElementById("comment-remove")
    const gifLoader = document.getElementById("loader")
    const txtAll = [txtName, txtComment]

    let takingText = false
}


btnSubmit.disabled = true


function jumpTo(element) {
    if (element)
        element.scrollIntoView({
            behavior: "smooth"
        })
}

function getValue(element) {
    return element.value.trim()
}

function clearInputs() {
    txtName.value = ""
    txtQuote.value = ""
    txtComment.value = ""
}

function insertInputEmptyStatus(element) {
    element.classList.add("add-form--error")
}

function removeEmptyInputStatus(element) {
    element.classList.remove("add-form--error")
}

function updateCommentBoxes() {
    document.querySelectorAll(".comment").forEach((box) => {
        box.addEventListener("click", () => {
            document.querySelector(".comment-editor").scrollIntoView()

            const recordId = Number(box.dataset.id)

            txtQuote.value = recordId
            txtComment.value = comments.printQuote(recordId, lblQuote)

            const element = lblQuote.parentElement

            root.style.setProperty(
                "--padding-for-comment",
                `${element.clientHeight + 26}px`
            )

            txtComment.classList.add("add-form-text--inclusive")
            txtComment.classList.remove("add-form-text--alone")

            element.classList.add("quote--visible")
            element.classList.remove("quote--invisible")
        })
    })
}

function updateCommentQuote() {
    document.querySelectorAll(".comment-quote").forEach((quote) => {
        quote.addEventListener("click", (e) => {
            const recordId = Number(quote.dataset.quoteid)
            const element = document.querySelector(`.comment[data-id="${recordId}"]`)

            e.stopPropagation()

            jumpTo(element)
        })
    })
}

function updateLikeButtons() {
    document.querySelectorAll(".like-button").forEach((button) => {
        button.addEventListener("click", (e) => {
            const recordId = Number(button.dataset.id)
            comments.updateLikeStatus(recordId)

            e.stopPropagation()

            render()
        })
    })
}

function updateLoadingState(show) {
    if (show)
        gifLoader.classList.remove("hidden")
    else
        gifLoader.classList.add("hidden")
}


txtName.addEventListener("dblclick", (e) => {
    if (!getValue(txtName) && e.button === 0) {
        txtName.value = "@log1422"

        removeEmptyInputStatus(txtName)

        if (getValue(txtComment))
            btnSubmit.disabled = false
    }
})

txtAll.forEach((element) => element.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !btnSubmit.disabled) {
        btnSubmit.click()
        e.preventDefault()
        e.stopPropagation()

        removeEmptyInputStatus(element)

        takingText = true

        btnSubmit.disabled = true
    }
}))

txtAll.forEach((element) => element.addEventListener("keyup", () => {
    const name = getValue(txtName)
    const comment = getValue(txtComment)

    let forcedBlock = false
    let wasErrorInName = name.length <= 3
    let wasErrorInComment = !comment

    if (element === txtName && wasErrorInName || element === txtComment && wasErrorInComment)
        insertInputEmptyStatus(element)
    else
        removeEmptyInputStatus(element)

    if (takingText) {
        removeEmptyInputStatus(element)

        forcedBlock = true
        takingText = false
    } else if (!gifLoader.classList.contains("hidden")) {
        forcedBlock = true
    }

    btnSubmit.disabled = forcedBlock || wasErrorInName || wasErrorInComment
}))

boxQuote.addEventListener("click", (e) => {
    const recordId = Number(txtQuote.value)
    const element = document.querySelector(`.comment[data-id="${recordId}"]`)

    e.stopPropagation()

    jumpTo(element)
})

btnCancelQ.addEventListener("click", (e) => {
    lblQuote.innerHTML = ""
    txtQuote.value = ""

    txtComment.classList.add("add-form-text--alone")
    txtComment.classList.remove("add-form-text--inclusive")

    const element = lblQuote.parentElement
    element.classList.add("quote--invisible")
    element.classList.remove("quote--visible")

    e.stopPropagation()
})

btnSubmit.addEventListener("click", () => {
    let name = getValue(txtName)
    let quoteID = getValue(txtQuote)
    let comment = getValue(txtComment)

    if (name.length <= 3 || !comment)
        return

    document.querySelector(".add-form-row").scrollIntoView()
    updateLoadingState(true)

    clearInputs()

    txtName.focus()
    btnCancelQ.click()

    btnSubmit.disabled = true

    comments.sendCommentToServer(name.sterilize(), comment.sterilize(), render, updateLoadingState)
})

btnRemove.addEventListener("click", () => {
    if (lstComments.children.length === 0)
        return

    comments.deleteLast()

    render()
})



function render() {
    lstComments.innerHTML = comments.printListItems()

    updateCommentBoxes()
    updateCommentQuote()
    updateLikeButtons()
}



comments.getCommentsFromServer(render, updateLoadingState)

const root = document.querySelector(":root")
const lblLeft = document.getElementById("cute-mode")
const lblRight = document.getElementById("devil-mode")
const btnSlot = document.getElementById("slot-button")
const btnArm = document.getElementById("arm-button")
const buttons = [btnSlot, btnArm]

let times = 0


let activateLeft = function () {
    lblLeft.classList.add("mode-active")
    lblRight.classList.remove("mode-active")
    btnArm.classList.remove("arm-changed")


    root.style.setProperty("--scroll", "var(--pear)")
    root.style.setProperty("--active", "var(--pear)")
    root.style.setProperty("--disabled", "gray")
    root.style.setProperty("--mine", "var(--green)")
    root.style.setProperty("--others", "var(--purple)")
    root.style.setProperty("--heart-empty", `url("./img/heart-empty.svg")`)
    root.style.setProperty("--heart-filled", `url("./img/heart-filled.svg")`)

    showEnoughTimes()
}

let activateRight = function () {
    lblLeft.classList.remove("mode-active")
    lblRight.classList.add("mode-active")
    btnArm.classList.add("arm-changed")


    root.style.setProperty("--scroll", "var(--red)")
    root.style.setProperty("--active", "#ec3030")
    root.style.setProperty("--disabled", "#9a4242")
    root.style.setProperty("--mine", "#ec7630")
    root.style.setProperty("--others", "var(--red)")
    root.style.setProperty("--heart-empty", `url("./img/heart-devil-empty.svg")`)
    root.style.setProperty("--heart-filled", `url("./img/heart-devil-filled.svg")`)

    showEnoughTimes()
}

function showEnoughTimes() {
    ++times

    if (times < 3)
        return

    btnArm.classList.add("arm--broken")

    activateLeft = function () {}
    activateRight = function () {}

    console.error("Доигрался. Сломал ручку переключателя. Молодцом!")
}


lblLeft.addEventListener("click", () => {
    if (lblRight.classList.contains("mode-active"))
        activateLeft()
})

lblRight.addEventListener("click", () => {
    if (lblLeft.classList.contains("mode-active"))
        activateRight()
})

buttons.forEach(
    (button) => button.addEventListener("click", () => {
        if (lblRight.classList.contains("mode-active"))
            activateLeft()
        else
            activateRight()
    })
)