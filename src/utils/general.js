export function copyDocumentWithout(document, ...args) {
    const copy = { ...document }

    for (let arg of args) {
        delete copy[arg]
    }

    return copy
}