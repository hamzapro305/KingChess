import { configureStore } from "@reduxjs/toolkit";
import ChessSlice from "./slices/ChessSlice";
import ArrowSlice from "./slices/ArrowSlice";

export const store = configureStore({
    reducer: {
        Chess: ChessSlice,
        Arrow: ArrowSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

// Infer the type of makeStore
// export type AppStore = ReturnType<typeof store>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
