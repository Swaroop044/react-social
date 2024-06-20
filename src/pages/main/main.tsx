// src/pages/main.tsx
import React, { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Post as PostComponent } from './post';

export interface Post {
    id: string;
    userId: string;
    title: string;
    username: string;
    description: string;
}

export const Main: React.FC = () => {
    const [postsList, setPostsList] = useState<Post[] | null>(null);

    const getPosts = async () => {
        const data = await getDocs(collection(db, "posts"));
        setPostsList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Post[]);
    };

    useEffect(() => {
        getPosts();
    }, []);

    return (
        <div>
            {postsList?.map((post) => (
                <PostComponent key={post.id} post={post} />
            ))}
        </div>
    );
};
