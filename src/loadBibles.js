import traverse from 'traverse';
// import bookNames from './Bible-kjv/Books.json';
// import * as booksData from './Bible-kjv/';
// import loadJsonFile from 'load-json-file';

function transformToVerses(acc, bookDataNode) {
  if (this.key === "verses") {
    const chapter = this.parent.node["chapter"];
    const book = this.parent.parent.parent.node["name"];
    const versesWithContext = bookDataNode.map((verse) => [
      { verse: verse.verse, text: verse.text, chapter, book },
    ]);
    return [...acc, ...versesWithContext];
  }
  return acc;
}


export async function loadBookData() {
    const response = await fetch('https://raw.githubusercontent.com/aruljohn/Bible-kjv/master/Books.json');
    if (response.ok) {
        const bookNames = await response.json();
        bookNames.reduce(async (acc, bookName) => {
            const strippedBookName = bookName.replace(/ /gi, '');
            const bookResponse = await fetch(`https://raw.githubusercontent.com/aruljohn/Bible-kjv/master/${strippedBookName}.json`);
            if (bookResponse.ok) {
                const bookData = bookResponse.json();
                traverse(bookData).reduce(transformToVerses, {})
            }
            return acc;
        }, []);
        return bookNames;
    }
    return [];
}

export default { loadBookData };