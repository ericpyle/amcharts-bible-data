import traverse from 'traverse';

function getVerseData(accVerses, verseInfo, chapter, book) {
  const { versesWithContext: prevVersesWithContext, bookPosition } = accVerses;
  const { verse, text } = verseInfo;
  const verseWordCount = text.split(' ').length;
  const nextBookPosition = bookPosition + verseWordCount;
  const versesWithContext = [...prevVersesWithContext, { book, chapter, verse, bookPosition, verseWordCount, text, textLength: text.length }];
  return { bookPosition: nextBookPosition, versesWithContext }; 
}

function addBibleWordPositions(accVerses, currentVerseData, iVerse) {
  let bibleWordPosition = 0;
  let bibleTextPosition = 0;
  if (iVerse > 0) {
    const prevVerseInfo = accVerses[iVerse - 1];
    bibleWordPosition = prevVerseInfo.bibleWordPosition + prevVerseInfo.verseWordCount;
    bibleTextPosition = prevVerseInfo.bibleTextPosition + prevVerseInfo.textLength;
  }
  accVerses.push({ ...currentVerseData, bibleWordPosition, bibleTextPosition });
  return accVerses;
}

function transformToVerses(accBook, bookDataNode) {
  if (this.key === "verses") {
    const chapter = this.parent.node["chapter"];
    const book = this.parent.parent.parent.node["book"];
    const { versesWithContext, bookPosition } = bookDataNode.reduce((accVerses, verse) =>
      getVerseData(accVerses, verse, chapter, book), { bookPosition: accBook.totalBookWordPosition, versesWithContext: [] }
    );
    return { totalBookWordPosition: bookPosition,  versesWithContext: [...accBook.versesWithContext, ...versesWithContext] };
  }
  return accBook;
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
        const { versesWithContext }  = traverse(bookData).reduce(transformToVerses, { versesWithContext: [], totalBookWordPosition: 0 });
        return versesWithContext;
    }));
    const allVersesData = eachBookVersesData.reduce((acc, versesInBook)=>acc.concat(versesInBook), []);
    const allVersesDataWithBibleWordPositions = allVersesData.reduce(addBibleWordPositions, []);
    console.log({ allVersesDataWithBibleWordPositions });
    return allVersesDataWithBibleWordPositions;
}

export default { loadBookData };