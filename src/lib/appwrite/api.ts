import { INewUser } from "@/types";
import { account, appwriteConfig, avatar, database } from "./config";
import { ID, Query } from 'appwrite';

export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(ID.unique(), user.email, user.password, user.name);
        if(!newAccount) throw Error;

        const avatarUrl = avatar.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            email: newAccount.email,
            name: newAccount.name,
            imageUrl: avatarUrl,
            username: user.username,
        });
        
        return newUser;
    } catch(error) {
        console.log(error)
        return error;
    }
}

export async function saveUserToDB(user: {
    accountId: string,
    email: string,
    name: string,
    imageUrl: URL,
    username?: string,
}) {
    try {
        const newUSer = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user
        )
        return newUSer;
    } catch (error) {
        throw new Error("Function not implemented.");
    }
}

export async function signInAccount(user: {
    email: string,
    password: string
}) {
    try {
        const session = await account.createEmailSession(user.email, user.password);
        return session;
    } catch(error) {
        console.log(error);
    }
}

// ============================== GET ACCOUNT
export async function getAccount() {
    try {
        const currentAccount = await account.get();
        return currentAccount;
    } catch (error) {
        console.log(error);
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await getAccount();

        if(!currentAccount) throw Error;

        const currentUser = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );
        
        if(!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
        return null;
    }
}

// ============================== GET ACCOUNT
export async function signOutAccount() {
    try {
        const session = await account.deleteSession('current');
        return session;
    } catch (error) {
        console.log(error)
    }
}
// ============================== GET POSTS
export async function searchPosts(searchTerm: string) {
    try {
        const posts = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.search('caption', searchTerm)]
        );

        if (!posts) throw Error;
        return posts;
    } catch (error) {
        console.log(error);
    }
}

export async function getInfinitePosts({ pageParam }: {pageParam:number}) {
    const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];

    if(pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()));
    }
    try {
        const posts = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            queries
        )
        if (!posts) throw Error;
        return posts;
    } catch (error) {
        console.log(error);
    }
}
// ============================== LIKE POST
export async function likePost(postId: string, likesArray: string[]) {
    try {
        const updatedPost = await database.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
            {likes: likesArray}
        );

        if (!updatedPost) throw Error;

        return updatedPost;
    } catch (error) {
        console.log(error);
    }
}

// ============================== SAVE POST
export async function savePost(userID:string, postId: string) {
    try {
        const updatedPost = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            ID.unique(),
            {
                user: userID,
                post: postId,
            }
            
            )
            if (!updatedPost) throw Error;

            return updatedPost;
    } catch (error) {
        console.log(error);
    }
}

// ============================== DELETE SAVED POST
export async function deleteSavedPost(savedRecordID: string) {
    try {
        const statusCode = await database.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            savedRecordID
        );

        if(!statusCode) throw Error;

        return {status: "Ok"}
    } catch (error) {
        console.log(error);
    }
}

// ============================== GET USER'S POST
export async function getUserPosts(userId?: string) {
    if(!userId) return;

    try {
        const posts = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.equal('creator', userId),Query.orderDesc("$createdAt")]
        )
        if (!posts) throw Error;

        return posts;
    } catch (error) {
        console.log(error);
    }
}

export async function getRecentPosts() {
    try {
        const posts = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.orderDesc("$createdAt"), Query.limit(20)]
        );
        if (!posts) throw Error;

        return posts;
    } catch (error) {
        console.log(error);
    }
}

// ============================================================
// USER
// ============================================================

// ============================== GET USERS
export async function getUsers(limit?: number) {
    const queries: any[] = [Query.orderDesc("$createdAt")];

    if(limit) {
        queries.push(Query.limit(limit))
    }

    try {
        const users = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            queries
        )
        if (!users) throw Error;

        return users;
    } catch (error) {
        console.log(error);
    }
}

// ============================== GET USER BY ID
export async function getUserById(userId: string) {
    try {
        const user = await database.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userId
        );

        if (!user) throw Error;

        return user;
    } catch (error) {
        console.log(error);
    }
}