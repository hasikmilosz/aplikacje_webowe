import { useEffect, useState } from "react";
import type { Post } from "../../types/Post/Post.ts";
import type { User } from "../../types/User/User.ts";
import type { Comment } from "../../types/Comment/Comment.ts";

import styles from './Post.module.scss';
import { Link, useParams } from "react-router";

export default function Post() {
    const { id } = useParams();
    const [post, setPost] = useState<Post | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        // Walidacja ID
        if (!id || !/^\d+$/.test(id)) {
            setIsError(true);
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            setIsError(false);

            try {
                const postRes = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
                if (!postRes.ok) throw new Error('Post not found');
                const postData: Post = await postRes.json();
                setPost(postData);

                const userRes = await fetch(`https://jsonplaceholder.typicode.com/users/${postData.userId}`);
                if (!userRes.ok) throw new Error('User not found');
                const userData: User = await userRes.json();
                setUser(userData);

                const commentsRes = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`);
                if (!commentsRes.ok) throw new Error('Comments not found');
                const commentsData: Comment[] = await commentsRes.json();
                setComments(commentsData);

            } catch (error) {
                setIsError(true);
                console.error('Fetch error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (isLoading) {
        return <p className={styles.PostLoading}>Trwa ładowanie...</p>;
    }

    if (isError || !post) {
        return (
            <div className={styles.PostError}>
                <p>Nieoczekiwany błąd lub post nie istnieje</p>
                <Link to="/posts" className={styles.BackLink}>Powrót do listy postów</Link>
            </div>
        );
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

            <h3 className={styles.CommentsTitle}>Komentarze ({comments.length})</h3>

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