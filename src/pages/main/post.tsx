// import React, { useEffect, useState } from 'react';
// import { addDoc, getDocs, collection, query, where , deleteDoc , doc} from 'firebase/firestore';
// import { auth, db } from '../../config/firebase';
// import { Post as IPost } from './main';
// import { useAuthState } from 'react-firebase-hooks/auth';

// interface Props {
//     post: IPost;
// }

// interface Like {
//     userId: string;
//     likeId  : string;
// }

// export const Post: React.FC<Props> = ({ post }) => {
//     const [user] = useAuthState(auth);
//     const [likes, setLikes] = useState<Like[] | null>(null);
//     const likesRef = collection(db, 'likes'); // Assuming 'likes' is the correct collection for likes

//     const likesDoc = query(likesRef, where('postId', '==', post.id));

//     const getLikes = async () => {
//         const data = await getDocs(likesDoc);
//         setLikes(data.docs.map((doc) => ({ userId: doc.data().userId , likeId : doc.id })));
//     };

//     const addLike = async () => {
//         try{

//             const newDoc = await addDoc(likesRef, { userId: user?.uid, postId: post.id });
//             getLikes(); // Refresh likes count after adding a like
//             if(user){
//                 setLikes((prev) => 
//                     prev ? [...prev , {userId : user.uid , likeId :newDoc.id }] : [{userId : user.uid , likeId :newDoc.id}])
//             }
//         }
//         catch(err){
//             console.log(err);
//         }
//     };

//     const removeLike = async () => {
//         try{
//             const likeToDeleteQuery = query(likesRef, where('postId', '==', post.id) , where("userId" , "==" , "user?.uid"));
//             const likeToDeleteData = await getDocs(likeToDeleteQuery)
//             const likeId = likeToDeleteData.docs[0].id
//             const likeToDelete = doc(db , "likes" , likeToDeleteData.docs[0].id )
//             await deleteDoc(likeToDelete);
//             if(user){
//                 setLikes((prev) => prev && prev.filter((like) => like.likeId !== likeId)
//             )}
//         }
//         catch(err){
//             console.log(err);
//         }
//     };


//     const hasUserLiked = likes?.find((like) => like.userId === user?.uid);


//     useEffect(() => {
//         getLikes();
//     }, [post.id]); // Add post.id to dependency array to call getLikes when the post changes

//     return (
//         <div className="App">
//             <div className="title">
//                 <h1>{post.title}</h1>
//             </div>
//             <div className="body">
//                 <p>{post.description}</p>
//             </div>
//             <div className="footer">
//                 <p>@{post.username}</p>
//                 <button onClick={hasUserLiked ? removeLike :addLike} disabled={!user}> {(hasUserLiked ? '👎' : '👍')} </button>
//                 {likes !== null && <p>Likes: {likes?.length}</p>}
//                 {!user && <p>Please log in to like posts</p>}
//             </div>
//         </div>
//     );
// };

import React, { useEffect, useState, useCallback } from 'react';
import { addDoc, getDocs, collection, query, where, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { Post as IPost } from './main';
import { useAuthState } from 'react-firebase-hooks/auth';

interface Props {
    post: IPost;
}

interface Like {
    userId: string;
    likeId: string;
}

export const Post: React.FC<Props> = ({ post }) => {
    const [user] = useAuthState(auth);
    const [likes, setLikes] = useState<Like[] | null>(null);
    const likesRef = collection(db, 'likes'); // Assuming 'likes' is the correct collection for likes

    const likesDoc = query(likesRef, where('postId', '==', post.id));

    const getLikes = useCallback(async () => {
        const data = await getDocs(likesDoc);
        setLikes(data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id })));
    }, [likesDoc]);

    const addLike = async () => {
        try {
            const newDoc = await addDoc(likesRef, { userId: user?.uid, postId: post.id });
            getLikes(); // Refresh likes count after adding a like
            if (user) {
                setLikes((prev) =>
                    prev ? [...prev, { userId: user.uid, likeId: newDoc.id }] : [{ userId: user.uid, likeId: newDoc.id }]
                );
            }
        } catch (err) {
            console.log(err);
        }
    };

    const removeLike = async () => {
        try {
            const likeToDeleteQuery = query(likesRef, where('postId', '==', post.id), where('userId', '==', user?.uid));
            const likeToDeleteData = await getDocs(likeToDeleteQuery);
            const likeId = likeToDeleteData.docs[0].id;
            const likeToDelete = doc(db, 'likes', likeToDeleteData.docs[0].id);
            await deleteDoc(likeToDelete);
            if (user) {
                setLikes((prev) => prev && prev.filter((like) => like.likeId !== likeId));
            }
        } catch (err) {
            console.log(err);
        }
    };

    const hasUserLiked = likes?.find((like) => like.userId === user?.uid);

    useEffect(() => {
        getLikes();
    }, [getLikes, post.id]); // Add getLikes to dependency array

    return (
        <div className="App">
            <div className="title">
                <h1>{post.title}</h1>
            </div>
            <div className="body">
                <p>{post.description}</p>
            </div>
            <div className="footer">
                <p>@{post.username}</p>
                <button onClick={hasUserLiked ? removeLike : addLike} disabled={!user}>
                    {hasUserLiked ? '👎' : '👍'}
                </button>
                {likes !== null && <p>Likes: {likes?.length}</p>}
                {!user && <p>Please log in to like posts</p>}
            </div>
        </div>
    );
};
