import { useEffect, useState } from "react"
import type {Post} from "../../types/Post/Post.ts";

import styles from './Posts.module.scss'
import {Link} from "react-router";

export default function Posts() {
    const [posts, setPosts] = useState<Post[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        (() => {
            setIsLoading(true)
        })()
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(response => response.json())
            .then((json: Post[]) => {
                setPosts(json)
            })
            .catch(() => {
                setIsError(true)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, []);

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
                    Wystąpił nieoczekiwany błąd
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
                                {p.body.substring(0, 50)}...
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
