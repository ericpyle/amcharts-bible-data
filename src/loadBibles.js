import fs from 'fs';
// import bookNames from './Bible-kjv/Books.json';
// import * as booksData from './Bible-kjv/';
// import loadJsonFile from 'load-json-file';

export async function loadBookData() {
    const response = await fetch('https://raw.githubusercontent.com/aruljohn/Bible-kjv/master/Books.json');
    if (response.ok) {
        const bookNames = await response.json();
        bookNames.reduce(async (acc, bookName) => {
            const strippedBookName = bookName.replace(/ /gi, '');
            const bookResponse = await fetch(`https://raw.githubusercontent.com/aruljohn/Bible-kjv/master/${strippedBookName}.json`);
            if (bookResponse.ok) {
                const bookData = bookResponse.json();
            }
            return acc;
        }, []);
        return bookNames;
    }
    return [];
}

export default { loadBookData };