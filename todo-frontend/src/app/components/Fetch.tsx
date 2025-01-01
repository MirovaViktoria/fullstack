"use client";
import React, { useState, useEffect } from "react";

type Todo = {
  id: number;
  documentId: string;
  Title: string;
  Checked: boolean;
};

export default function FetchTodoComponent() {
  const [data, setData] = useState<Todo[]>([]);

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
      setData(responseData.data);
      console.log(responseData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchDataApi();
  }, []);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevents the form from submitting and reloading the page
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title");
    console.log("Form Data:", { title });

    const data = {
      data: {
        Checked: false,
        Title: title, // Assuming that form's title corresponds to the Title key in your payload
      },
    };

    // Make the POST request using fetch
    await fetch("http://localhost:1337/api/to-do-items", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization:
          "Bearer 07358db0f693f951ca3382e4666c8cfe87820ed4afd51716f61caba341b88c6477bd9e07d81c058e82d54fa641b6ddce84250a4d88b159efb9cd6af42726e6be4a88f0054f2502e321b8906c7c064584e0543dd226836c2e72496a4d946ebd3ae880bb2718a0809162339cb21eedcbbb0d52a8a306fc3e3a648a40eb0f63055d",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };
  const handleDeleteClick = async (id: string) => {
    await fetch("http://localhost:1337/api/to-do-items/" + id, {
      method: "DELETE",
      headers: {
        Authorization:
          "Bearer 07358db0f693f951ca3382e4666c8cfe87820ed4afd51716f61caba341b88c6477bd9e07d81c058e82d54fa641b6ddce84250a4d88b159efb9cd6af42726e6be4a88f0054f2502e321b8906c7c064584e0543dd226836c2e72496a4d946ebd3ae880bb2718a0809162339cb21eedcbbb0d52a8a306fc3e3a648a40eb0f63055d",
        "Content-Type": "application/json",
      },
    });

    console.log("Delete ID:", id);
  };
  const handleChange = async (id: string) => {
    setData((prevTodos) =>
      prevTodos.map((todo) => {
        if (todo.documentId === id) {
          return { ...todo, Checked: !todo.Checked };
        }
        return todo;
      })
    );

    let currentTodo: Todo | undefined;
    data.map((todo) => {
      if (todo.documentId === id) {
        currentTodo = todo;
      }
      return todo;
    });
    if (currentTodo != null) {
      const putData = {
        data: {
          Checked: !currentTodo.Checked,
        },
      };
      await fetch("http://localhost:1337/api/to-do-items/" + id, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization:
            "Bearer 07358db0f693f951ca3382e4666c8cfe87820ed4afd51716f61caba341b88c6477bd9e07d81c058e82d54fa641b6ddce84250a4d88b159efb9cd6af42726e6be4a88f0054f2502e321b8906c7c064584e0543dd226836c2e72496a4d946ebd3ae880bb2718a0809162339cb21eedcbbb0d52a8a306fc3e3a648a40eb0f63055d",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(putData),
      });
    }
  };
  return (
    <div>
      <h1>To-Do List</h1>
      <ul>
        {data.map((todo, index) => (
          <li key={index}>
            <input
              type="checkbox"
              checked={todo.Checked}
              onChange={() => handleChange(todo.documentId)}
            />
            {todo.Title}
            <button onClick={() => handleDeleteClick(todo.documentId)}>
              x
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleFormSubmit}>
        <input name="title"></input>
        <input type="submit"></input>
      </form>
    </div>
  );
}
