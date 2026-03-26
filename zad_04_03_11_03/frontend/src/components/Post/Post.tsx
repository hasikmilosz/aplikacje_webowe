import { useQuery } from "@tanstack/react-query";
import type { Post } from "../../types/Post/Post.ts";
//import type { User } from "../../types/User/User.ts";
import type { Comment } from "../../types/Comment/Comment.ts";

import {useState} from "react";
import styles from './Post.module.scss';
import { Link, useParams } from "react-router";
import * as React from "react";

const fetchPost = async (id: string): Promise<Post> => {
    const response = await fetch(`/api/posts/${id}`);
    if (!response.ok) throw new Error('Post not found');
    return response.json();
};

/*const fetchUser = async (userId: number): Promise<User> => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    if (!response.ok) throw new Error('User not found');
    return response.json();
};*/

const fetchComments = async (postId: string): Promise<Comment[]> => {
    const response = await fetch(`/api/posts/${postId}/comments`);
    if (!response.ok) throw new Error('Comments not found');
    return response.json();
};

export default function Post() {
    const { id } = useParams();
    const [content, setContent] = useState("");
    const [, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) return;

        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/posts/${id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId: id,
                    created_at: Date.now(),
                    createdBy: "Anonim",
                    content: content.trim()
                })
            });

            if (!response.ok) {
                throw new Error('Błąd podczas dodawania komentarza');
            }

            setContent('');

        } catch (error) {
            console.error('Błąd:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

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
    /*const {
        data: user,
        isLoading: userLoading
    } = useQuery({
        queryKey: ['user', post?.userId],
        queryFn: () => fetchUser(post!.userId),
        enabled: !!post,
    });*/

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

    const isLoading = postLoading || (post && /*(userLoading || */commentsLoading/*)*/);

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

            {/*user && (
                <span className={styles.PostAuthor}>
                    {user.username}, {user.email}
                </span>
            )*/}

            <p className={styles.PostContent}>{post.content}</p>

            <h3 className={styles.CommentsTitle}>
                Komentarze ({comments.length})
                {commentsError && <span> (błąd ładowania komentarzy)</span>}
            </h3>
            <div className={styles.AddComment} >
                <h6 className={styles.AddCommentTitle}>Dodaj komentarz</h6>
                <form className={styles.AddCommentForm} onSubmit={handleSubmit}>
                    <input value={content} onChange={(e)=>setContent(e.target.value)} type="text" className={styles.AddCommentInput} placeholder={"Dodaj komentarz..."} />
                    <button type="submit" className={styles.AddCommentButton}>Wyślij</button>
                </form>
            </div>
            {comments.map((comment) => (
                <div className={styles.Comment} key={comment.id}>
                    <p className={styles.CommentTitle}>{comment.postId}</p>
                    <p className={styles.CommentUser}>
                        {comment.created_by}
                    </p>
                    <p className={styles.CommentBody}>{comment.content}</p>
                </div>
            ))}

            <Link to="/posts" className={styles.BackLink}>
                Powrót do listy postów
            </Link>
        </div>
    );
}