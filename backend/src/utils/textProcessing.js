// textProcessing.js
export function buildUserDocument(user) {
    // combine fields you care about
    const skillsText = (user.skills || []).join(" ");
    const aboutText = user.about || "";
    return `${skillsText} ${aboutText}`;
}

export function preprocess(text) {



}

export function buildVocabulary(documents) {
    // documents: array of token arrays
    // return: { token -> index }
}

export function computeTfIdfMatrix(tokenizedDocs, vocab) {
    // returns an array of vectors (one per doc)
    // each vector is an array [v0, v1, ..., vN] based on vocab
}