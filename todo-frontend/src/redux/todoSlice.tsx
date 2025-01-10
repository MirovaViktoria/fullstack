import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todo } from "node:test";

// Вид одной записи
type Todo = {
  id: number;
  documentId: string;
  Title: string;
  Checked: boolean;
  date: string;
};

// Массив обьектов с кучей записей
type TodosState = {
  todos: Todo[];
};

// Начальное состояние
const initialState: TodosState = {
  todos: [],
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.todos = action.payload;
    },
    submitTodos: (state, action: PayloadAction<Todo>) => {
      state.todos.push(action.payload);
    },
    updateTodos: (
      state,
      action: PayloadAction<{ documentId: string; Checked: boolean }>
    ) => {
      const todosFind = state.todos.find(
        (todo) => todo.documentId === action.payload.documentId
      );
      if (todosFind) {
        todosFind.Checked = action.payload.Checked;
      }
    },
    removeTodos: (state, action: PayloadAction<{ documentId: string }>) => {
      state.todos = state.todos.filter(
        (todo) => todo.documentId !== action.payload.documentId
      );
    },
  },
});

export const { setTodos, updateTodos, submitTodos, removeTodos } =
  todosSlice.actions;
export default todosSlice.reducer;
