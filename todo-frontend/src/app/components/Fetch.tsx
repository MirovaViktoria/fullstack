"use client";
import { RootState } from "@/redux/store";
import {
  setTodos,
  updateTodos,
  submitTodos,
  removeTodos,
} from "@/redux/todoSlice";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Alert from "@mui/material/Alert";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Snackbar from "@mui/material/Snackbar";

type Todo = {
  id: number;
  documentId: string;
  Title: string;
  Checked: boolean;
  date: string;
};

export default function FetchTodoComponent() {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchDataApi = async () => {
    try {
      const response = await fetch("http://localhost:1337/api/to-do-items", {
        method: "GET",
        headers: {
          Authorization:
            "Bearer 07358db0f693f951ca3382e4666c8cfe87820ed4afd51716f61caba341b88c6477bd9e07d81c058e82d54fa641b6ddce84250a4d88b159efb9cd6af42726e6be4a88f0054f2502e321b8906c7c064584e0543dd226836c2e72496a4d946ebd3ae880bb2718a0809162339cb21eedcbbb0d52a8a306fc3e3a648a40eb0f63055d",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch data");
        return;
      }

      const responseData = await response.json();
      const todosDate = responseData.data.map((todo: Todo) => ({
        ...todo,
        date: new Date(todo.date).toLocaleString("ru-RU"), // Format date here
      }));
      dispatch(setTodos(todosDate));
      //   setData(responseData.data);
      console.log(responseData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchDataApi();
  }, []);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title");

    if (!title) {
      setErrorMessage("Поле не должно быть пустым"); // Set error message
      return;
    }
    setErrorMessage(null); // Reset error message if title is valid

    console.log("Form Data:", { title });

    const data = {
      data: {
        Checked: false,
        Title: title,
        date: new Date(), // Assuming that form's title corresponds to the Title key in your payload
      },
    };

    // Make the POST request using fetch
    const response = await fetch("http://localhost:1337/api/to-do-items", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization:
          "Bearer 07358db0f693f951ca3382e4666c8cfe87820ed4afd51716f61caba341b88c6477bd9e07d81c058e82d54fa641b6ddce84250a4d88b159efb9cd6af42726e6be4a88f0054f2502e321b8906c7c064584e0543dd226836c2e72496a4d946ebd3ae880bb2718a0809162339cb21eedcbbb0d52a8a306fc3e3a648a40eb0f63055d",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    const newTodo: Todo = {
      id: result.data.id,
      documentId: result.data.documentId,
      Title: result.data.Title,
      Checked: result.data.Checked,
      date: new Date(result.data.date).toLocaleString("ru-RU"),
    };
    dispatch(submitTodos(newTodo));

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDeleteClick = async (id: string) => {
    try {
      const response = await fetch(
        "http://localhost:1337/api/to-do-items/" + id,
        {
          method: "DELETE",
          headers: {
            Authorization:
              "Bearer 07358db0f693f951ca3382e4666c8cfe87820ed4afd51716f61caba341b88c6477bd9e07d81c058e82d54fa641b6ddce84250a4d88b159efb9cd6af42726e6be4a88f0054f2502e321b8906c7c064584e0543dd226836c2e72496a4d946ebd3ae880bb2718a0809162339cb21eedcbbb0d52a8a306fc3e3a648a40eb0f63055d",
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      dispatch(removeTodos({ documentId: id }));
      console.log("Delete ID:", id);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleChange = async (id: string) => {
    const todo = todos.find((todo) => todo.documentId === id);
    if (!todo) {
      console.error("Todo not found");
      return;
    }
    if (todos) {
      dispatch(
        updateTodos({
          documentId: id,
          Checked: !todo.Checked,
        })
      );
      await fetch("http://localhost:1337/api/to-do-items/" + id, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization:
            "Bearer 07358db0f693f951ca3382e4666c8cfe87820ed4afd51716f61caba341b88c6477bd9e07d81c058e82d54fa641b6ddce84250a4d88b159efb9cd6af42726e6be4a88f0054f2502e321b8906c7c064584e0543dd226836c2e72496a4d946ebd3ae880bb2718a0809162339cb21eedcbbb0d52a8a306fc3e3a648a40eb0f63055d",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: { Checked: !todo.Checked } }),
      });
    }
  };
  // const handleChange = async (id: string) => {
  //   setData((prevTodos) =>
  //     prevTodos.map((todo) => {
  //       if (todo.documentId === id) {
  //         return { ...todo, Checked: !todo.Checked };
  //       }
  //       return todo;
  //     })
  //   );
  //   let currentTodo: Todo | undefined;
  //   data.map((todo) => {
  //     if (todo.documentId === id) {
  //       currentTodo = todo;
  //     }
  //     return todo;
  //   });
  //   if (currentTodo != null) {
  //     const putData = {
  //       data: {
  //         Checked: !currentTodo.Checked,
  //       },
  //     };
  //     await fetch("http://localhost:1337/api/to-do-items/" + id, {
  //       method: "PUT",
  //       headers: {
  //         Accept: "application/json",
  //         Authorization:
  //           "Bearer 07358db0f693f951ca3382e4666c8cfe87820ed4afd51716f61caba341b88c6477bd9e07d81c058e82d54fa641b6ddce84250a4d88b159efb9cd6af42726e6be4a88f0054f2502e321b8906c7c064584e0543dd226836c2e72496a4d946ebd3ae880bb2718a0809162339cb21eedcbbb0d52a8a306fc3e3a648a40eb0f63055d",
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(putData),
  //     });
  //   }
  // };
  return (
    <div>
      {errorMessage && (
        <Snackbar
          open={!!errorMessage}
          autoHideDuration={3000}
          onClose={() => setErrorMessage(null)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="error">{errorMessage}</Alert>
        </Snackbar>
      )}

      <h1>To-Do List</h1>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            <Checkbox
              checked={todo.Checked}
              onChange={() => handleChange(todo.documentId)}
              inputProps={{ "aria-label": "controlled" }}
            />
            {/* <input
              type="checkbox"
              checked={todo.Checked}
              onChange={() => handleChange(todo.documentId)}
            /> */}
            {todo.Title} - {todo.date}
            <IconButton
              aria-label="delete"
              size="small"
              onClick={() => handleDeleteClick(todo.documentId)}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
            {/* <button onClick={() => handleDeleteClick(todo.documentId)}>
              x
            </button> */}
          </li>
        ))}
      </ul>
      <form onSubmit={handleFormSubmit}>
        <input name="title" ref={inputRef}></input>
        <input type="submit"></input>
      </form>
    </div>
  );
}
