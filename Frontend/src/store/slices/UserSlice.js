import { createSlice, createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import axios from 'axios'


axios.defaults.withCredentials = true
const TodoApi = axios.create({
    baseURL: 'http://localhost:8081/',
});

// User SignUp
export const UserSignup = createAsyncThunk('postUser', async (data, { rejectWithValue }) => {
    try {
        const response = await TodoApi.post('signup', data)
        return response.data;
    } catch (error) {
        console.log('err', error);
        return rejectWithValue(error)
    }
})

// UserLogin
export const UserLogin = createAsyncThunk('LoginUser', async (data, { rejectWithValue }) => {
    try {
        const response = await TodoApi.post('login', data)
        console.log('Login_data...', data);
        return response.data;
    } catch (error) {
        console.log('err', error);
        return rejectWithValue(error)
    }
})
// User Logout
export const LogoutUser = createAsyncThunk('user logout', async (data, { rejectWithValue }) => {
    try {
        const response = await TodoApi.get('logout', data)
        // console.log('Verify_data...', data);
        return response.data;
    } catch (error) {
        console.log('err', error);
        return rejectWithValue(error)
    }
})
// VerifyUser
export const VerifyUser = createAsyncThunk('userVerify', async (data, { rejectWithValue }) => {
    try {
        const response = await TodoApi.get('verify', data)
        // console.log('Verify_data...', data);
        return response.data;
    } catch (error) {
        console.log('err', error);
        return rejectWithValue(error)
    }
})

// Post Todo
export const PostTodo = createAsyncThunk('TodoPost', async (data, { rejectWithValue }) => {
    try {
        console.log('data from todo comp...', data);
        const response = await TodoApi.post('todo', data)
        console.log('Todo_data...', response);
        return response.data;
    } catch (error) {
        console.log('err', error);
        return rejectWithValue(error)
    }
})

// Get Todo
export const GetTodo = createAsyncThunk('TodoGet', async (data, { rejectWithValue }) => {
    try {
        console.log('data from todo comp...', data);
        const response = await TodoApi.get('gettodo')
        console.log('Todo_data...', response);
        return response.data;
    } catch (error) {
        console.log('err', error);
        return rejectWithValue(error)
    }
})


// export const Session = createAsyncThunk('User session', async () => {
//     const response = await TodoApi.get('session')
//     console.log('response', response);
//     return response;
// })

export const FetchUserList = createAsyncThunk('fetchUser', async () => {
    const response = await TodoApi.get('user')
    console.log('response', response);
    return response;
})


const initialState = {
    user: [],
    Todos: {},
    loading: false,
    error: null
}
const todoSlice = createSlice({
    name: "todo",
    initialState,
    extraReducers:
    {
        // User SignUp Reducer
        [UserSignup.pending]: (state) => {
            state.loading = true
        },
        [UserSignup.fulfilled]: (state, action) => {
            state.loading = false
            state.user.push(action.payload)
        },
        [UserSignup.error]: (state, action) => {
            state.loading = false
            state.user = action.payload
        },

        // User Login Reducer
        [UserLogin.pending]: (state) => {
            state.loading = true
        },
        [UserLogin.fulfilled]: (state, action) => {
            state.loading = false
            state.user.push(action.payload)
        },
        [UserLogin.error]: (state, action) => {
            state.loading = false
            state.user = action.payload
        },

        // User Verification Reducer
        [VerifyUser.pending]: (state) => {
            state.loading = true
        },
        [VerifyUser.fulfilled]: (state, action) => {
            state.loading = false
            state.user.push(action.payload)
        },
        [VerifyUser.error]: (state, action) => {
            state.loading = false
            state.user = action.payload
        },

        // User Logout Reducer
        [LogoutUser.pending]: (state) => {
            state.loading = true
        },
        [LogoutUser.fulfilled]: (state, action) => {
            state.loading = false
            state.user = []
        },
        [LogoutUser.error]: (state, action) => {
            state.loading = false
            state.user = action.payload
        },

        // Post Todo Reducer
        [PostTodo.pending]: (state) => {
            state.loading = true
        },
        [PostTodo.fulfilled]: (state, action) => {
            state.loading = false
            state.user.push(action.payload)
        },
        [PostTodo.error]: (state, action) => {
            console.log('action.payload', action.payload);
            state.loading = false
            state.user = action.payload
        },
        // Get Todo Reducer
        [GetTodo.pending]: (state) => {
            state.loading = true
        },
        [GetTodo.fulfilled]: (state, action) => {
            state.loading = false
            state.Todos = action.payload
        },
        [GetTodo.error]: (state, action) => {
            console.log('action.payload', action.payload);
            state.loading = false
            state.user = action.payload
        },
    },
    reducers: {
        addItem(state, action) {
            state.Todos.push(action.payload)
        },
        deleteItem(state, action) {
            state.Todos = state.Todos.filter((todo) => todo.id !== action.payload.id);
        },

        editItem(state, action) {
            state.Todos = state.Todos.map((elem) => {
                if (elem.id === action.payload.id) {
                    return { ...elem, text: action.payload.text }
                }
                return elem;
            })
        },
        completeItem(state, action) {
            // let todoArr = []
            state.Todos = state.Todos.map(todo => {
                if (todo.id === action.payload.id) {
                    return { ...state.Todos, isComplete: true, text: action.payload.text }

                }
                return todo;
            })
        }
    }
})

export default todoSlice.reducer;
export const { addItem, deleteItem, editItem, completeItem } = todoSlice.actions;