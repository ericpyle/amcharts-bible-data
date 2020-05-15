import traverse from 'traverse';
// import bookNames from './Bible-kjv/Books.json';
// import * as booksData from './Bible-kjv/';
// import loadJsonFile from 'load-json-file';

function transformToVerses(acc, bookDataNode) {
  if (this.key === "verses") {
    const chapter = this.parent.node["chapter"];
    const book = this.parent.parent.parent.node["book"];
    const versesWithContext = bookDataNode.map((verse) =>
      ({ verse: verse.verse, text: verse.text, chapter, book })
    );
    return [...acc, ...versesWithContext];
  }
  return acc;
}


export async function loadBookData() {
    const response = await fetch('https://raw.githubusercontent.com/aruljohn/Bible-kjv/master/Books.json');
    if (!response.ok)
        return [];
    const bookNames = await response.json();
    const eachBookVersesData = await Promise.all(bookNames.map(async (bookName) => {
        const strippedBookName = bookName.replace(/ /gi, '');
        const bookResponse = await fetch(`https://raw.githubusercontent.com/aruljohn/Bible-kjv/master/${strippedBookName}.json`);
        if (!bookResponse.ok)
            return [{book: bookName}];
        const bookData = await bookResponse.json();
        const versesInBook = traverse(bookData).reduce(transformToVerses, []);
        return versesInBook;
    }));
    const allVersesData = eachBookVersesData.reduce((acc, versesInBook)=>acc.concat(versesInBook), []);
    console.log({ allVersesData });
    return allVersesData;
}

export default { loadBookData };