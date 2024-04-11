import {
    format
} from "date-fns";
export function sanitize(text) {
    return text
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
};

export function normalizeComments(comments) {
    return comments.map((comment) => {
        return {
            name: comment.author.name,
            time: format(new Date(comment.date), 'yyyy-MM-dd HH:mm:ss'),
            comment: comment.text,
            likes: comment.likes,
            isliked: false,
        }
    });
}