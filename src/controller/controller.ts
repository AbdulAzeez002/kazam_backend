import { Request, Response, json } from "express";
import { client } from "../config/redis";
import mongoose from "mongoose";
import Todo from "../models/TodoSchema";


// Controller to Adding Todo to Redis
export const addTodo = async (todo: string) => {
  try {
    const id = new mongoose.Types.ObjectId();
    const todoObj = {
      _id: id,
      todo: todo,
    };
    const res = await client.lPush(
      "FULLSTACK_TASK_ABDUL",
      JSON.stringify(todoObj)
    );

    // Checking whether no of elements in cache reached 50 and moving the items to mongo and flushing the cache
    if (res === 3) {
      await AddTodosToMongo();
      await client.del("FULLSTACK_TASK_ABDUL");
    }
    
    return todoObj
  } catch (error) {}
};

// Controller for getting all the Todos
// Todos are taken from both redis and mongodb and concatenated into a single array

export const getAllTodos = async (req: Request, res: Response) => {
  const todosFromRedis: { _id: string; todo: string }[] =
    await getTodosFromRedis();
  const todosFromMongoDb = await Todo.find({});

  res.json({ todos: [...todosFromRedis, ...todosFromMongoDb.reverse()] });
};


// Adding Todos to mongodb once cache elements reached 50

const AddTodosToMongo = async () => {
  try {
    const todos = await getTodosFromRedis();
    await Todo.insertMany(todos.reverse());
  } catch (error) {
    console.log(error, "error while adding todos to mongodb");
  }
};


// Function for geting Todos from Redis
const getTodosFromRedis = async () => {
  const todos = await client?.lRange("FULLSTACK_TASK_ABDUL", 0, -1);
  const parsedTodos: { _id: string; todo: string }[] = todos?.map((todo) => {
    const parsedTodo = JSON.parse(todo);
    return { _id: parsedTodo._id, todo: parsedTodo.todo };
  });
  return parsedTodos;
};
