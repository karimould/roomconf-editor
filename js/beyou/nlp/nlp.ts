export let tokenize = (text: string) => text.toLowerCase().split(/\s+/g);

// dictonary with unique words
export let dictionary = (tokens: string[], dict: string[]) => {
  tokens.forEach((token) => {
    if (!dict.includes(token)) {
      dict.push(token);
    }
  });
  return dict;
};

//to vector sapce model
export let vsm = (tokens: string[], dict: string[]) => dict.map((token) => tokens.reduce((acc, curr) => (curr == token ? acc + 1 : acc), 0));

/*
 * term frequency
 * TF = (Number of time the term appears in the document) / (Total number of words in document)
 */
export let tf = (vsm: number[], numberOfTokens: number) => vsm.map((token) => token / numberOfTokens);

/*
 * Inverse Document Frequency
 * IDF = (Total number of documents) / (total number of documents containing the keyword)
 */
export let idff = (documentTokens: string[][], dict: string[]) => dict.map((word) => Math.log(2 / documentTokens.reduce((acc, curr) => (curr.includes(word) ? 1 : 0 + acc), 0)));

/*
 * Similarly
 */
export let tfidf = (tf: number[], idf: number[]) => tf.map((element, index) => element * idf[index]);

/*
 * cosine-similarity
 */
export let cosine = (tfIdf1: number[], tfIdf2: number[]) =>
  tfIdf1.reduce((acc, curr, index) => acc + curr * tfIdf2[index], 0) / (Math.sqrt(tfIdf1.reduce((acc, curr) => acc + curr * curr, 0)) * Math.sqrt(tfIdf2.reduce((acc, curr) => acc + curr * curr, 0)));
