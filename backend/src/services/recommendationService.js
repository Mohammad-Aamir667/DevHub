// recommendation.js
import { buildUserDocument, preprocess, buildVocabulary, computeTfIdfMatrix } from "../utils/textProcessing.js";
import { cosineSimilarity } from "../utils/similarity.js";

export async function getRecommendedUsers(loggedInUser, candidates, { skip, limit }) {
    // 1) Build documents
    const loggedInDoc = preprocess(buildUserDocument(loggedInUser));
    const candidateDocs = candidates.map(u => preprocess(buildUserDocument(u)));

    // 2) Build vocabulary over ALL docs (loggedIn + candidates)
    const allDocs = [loggedInDoc, ...candidateDocs];
    const vocab = buildVocabulary(allDocs);

    // 3) Compute TF-IDF vectors for all docs
    const tfidfMatrix = computeTfIdfMatrix(allDocs, vocab);
    const loggedInVec = tfidfMatrix[0];
    const candidateVecs = tfidfMatrix.slice(1);

    // 4) Compute similarity for each candidate
    const scored = candidates.map((user, idx) => ({
        user,
        score: cosineSimilarity(loggedInVec, candidateVecs[idx]),
    }));

    // 5) Sort by score desc
    scored.sort((a, b) => b.score - a.score);

    // 6) Apply pagination
    const paginated = scored.slice(skip, skip + limit).map(item => item.user);

    return paginated;
}