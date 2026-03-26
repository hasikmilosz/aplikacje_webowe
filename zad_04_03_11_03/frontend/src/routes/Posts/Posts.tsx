import { useQuery } from "@tanstack/react-query"
import type {Post} from "../../types/Post/Post.ts";
import styles from './Posts.module.scss'
import {Link} from "react-router";

const fetchPosts = async (): Promise<Post[]> => {
    const response = await fetch('/api/posts')
    if (!response.ok) {
        throw new Error('Network response was not ok')
    }
    return response.json()
}

export default function Posts() {
    const {
        data: posts = [],
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ['posts'],
        queryFn: fetchPosts,
        staleTime: 1000 * 60 * 5, // 5 minut
        gcTime: 1000 * 60 * 10, // 10 minut
        retry: 2,
    })

    if (isError) {
        console.error('Błąd pobierania postów:', error)
    }

    return (
        <div className={styles.Posts}>
            {isLoading && (
                <div className={styles.PostsLoading}>
                    <div className={styles.PostsLoadingLoader}>
                        <div></div>
                    </div>
                    Trwa ładowanie...
                </div>
            )}

            {isError && (
                <div className={styles.PostsError}>
                    Wystąpił nieoczekiwany błąd: {error instanceof Error ? error.message : 'Nieznany błąd'}
                </div>
            )}

            {!isLoading && !isError && (
                <>
                    {posts.length === 0 && (
                        <div className={styles.PostsError}>
                            Brak wpisów
                        </div>
                    )}

                    {posts.map(p => (
                        <div className={styles.PostsPost} key={p.id}>
                            <h5 className={styles.PostsPostTitle}>
                                {p.title.substring(0, 20)}...
                            </h5>
                            <p className={styles.PostsPostBody}>
                                {p.content.substring(0, 50)}...
                            </p>
                            <Link
                                className={styles.PostsPostLink}
                                to={"/posts/" + p.id}
                            >
                                Przejdź do wpisu
                            </Link>
                        </div>
                    ))}
                </>
            )}
        </div>
    )
}