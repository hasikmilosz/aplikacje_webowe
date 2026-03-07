import { useQuery } from "@tanstack/react-query";
import type { Post } from "../../types/Post/Post.ts";
import type { User } from "../../types/User/User.ts";
import type { Comment } from "../../types/Comment/Comment.ts";

import styles from './Post.module.scss';
import { Link, useParams } from "react-router";

const fetchPost = async (id: string): Promise<Post> => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
    if (!response.ok) throw new Error('Post not found');
    return response.json();
};

const fetchUser = async (userId: number): Promise<User> => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    if (!response.ok) throw new Error('User not found');
    return response.json();
};

const fetchComments = async (postId: string): Promise<Comment[]> => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
    if (!response.ok) throw new Error('Comments not found');
    return response.json();
};

export default function Post() {
    const { id } = useParams();

    const isValidId = id && /^\d+$/.test(id);

    // 1. Zapytanie o post
    const {
        data: post,
        isLoading: postLoading,
        isError: postError,
        error: postErrorData
    } = useQuery({
        queryKey: ['post', id],
        queryFn: () => fetchPost(id!),
        enabled: !!isValidId,
        retry: 1
    });

    // 2. Zapytanie o użytkownika
    const {
        data: user,
        isLoading: userLoading
    } = useQuery({
        queryKey: ['user', post?.userId],
        queryFn: () => fetchUser(post!.userId),
        enabled: !!post,
    });

    // 3. Zapytanie o komentarze
    const {
        data: comments = [],
        isLoading: commentsLoading,
        isError: commentsError
    } = useQuery({
        queryKey: ['comments', id],
        queryFn: () => fetchComments(id!),
        enabled: !!isValidId,
    });

    const isLoading = postLoading || (post && (userLoading || commentsLoading));

    if (!isValidId || postError) {
        console.error('Błąd:', postErrorData);
        return (
            <div className={styles.PostError}>
                <p>Nieoczekiwany błąd lub post nie istnieje</p>
                <Link to="/posts" className={styles.BackLink}>Powrót do listy postów</Link>
            </div>
        );
    }

    if (isLoading) {
        return <p className={styles.PostLoading}>Trwa ładowanie...</p>;
    }

    if (!post) {
        return null;
    }

    return (
        <div className={styles.Post}>
            <h2 className={styles.PostTitle}>{post.title}</h2>

            {user && (
                <span className={styles.PostAuthor}>
                    {user.username}, {user.email}
                </span>
            )}

            <p className={styles.PostContent}>{post.body}</p>

            <h3 className={styles.CommentsTitle}>
                Komentarze ({comments.length})
                {commentsError && <span> (błąd ładowania komentarzy)</span>}
            </h3>

            {comments.map((comment) => (
                <div className={styles.Comment} key={comment.id}>
                    <p className={styles.CommentTitle}>{comment.name}</p>
                    <p className={styles.CommentUser}>
                        {comment.email.substring(0, comment.email.search("@"))}
                    </p>
                    <p className={styles.CommentBody}>{comment.body}</p>
                </div>
            ))}

            <Link to="/posts" className={styles.BackLink}>
                Powrót do listy postów
            </Link>
        </div>
    );
}